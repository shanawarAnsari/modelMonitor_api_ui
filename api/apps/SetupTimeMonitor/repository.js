const { executeQuery } = require("../common");

// Get available months from SETUP_TIME_MONITOR
const getAvailableMonths = async () => {
  try {
    const query = `
      SELECT DISTINCT 
        FORMAT(ACTUAL_START_DATE, 'yyyy-MM') as value,
        DATENAME(MONTH, ACTUAL_START_DATE) + ' ' + CAST(YEAR(ACTUAL_START_DATE) AS VARCHAR) as label,
        MONTH(ACTUAL_START_DATE) as month,
        YEAR(ACTUAL_START_DATE) as year
      FROM SETUP_TIME_MONITOR
      WHERE ACTUAL_START_DATE IS NOT NULL
      ORDER BY value DESC
    `;

    const result = await executeQuery(query);
    return result.recordset;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// Get metric cards for selected month
const getMetricCards = async (selectedMonth) => {
  try {
    const query = `
      SELECT 
        COUNT(DISTINCT PROCESS_ORDER_NUMBER) as numberOfPO,
        AVG(CAST(RECOMMENDED_ST_ABSOLUTE_ERROR AS FLOAT)) as aimlRoMAE,
        AVG(CAST(NEW_ST_ABSOLUTE_ERROR AS FLOAT)) as plannedRoMAE
      FROM SETUP_TIME_MONITOR
      WHERE FORMAT(ACTUAL_START_DATE, 'yyyy-MM') = @selectedMonth
        AND RECOMMENDED_ST_ABSOLUTE_ERROR IS NOT NULL
        AND NEW_ST_ABSOLUTE_ERROR IS NOT NULL
    `;

    const result = await executeQuery(query, { selectedMonth });

    return result.recordset[0] || { numberOfPO: 0, aimlRoMAE: 0, plannedRoMAE: 0 };
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// Get metric trends cards for spark charts
const getMetricTrendsCards = async () => {
  try {
    const query = `
      SELECT 
        FORMAT(ACTUAL_START_DATE, 'yyyy-MM') as monthKey,
        DATENAME(MONTH, ACTUAL_START_DATE) as month,
        YEAR(ACTUAL_START_DATE) as year,
        COUNT(DISTINCT PROCESS_ORDER_NUMBER) as numberOfPO,
        AVG(CAST(RECOMMENDED_ST_ABSOLUTE_ERROR AS FLOAT)) as aimlRoMAE,
        AVG(CAST(NEW_ST_ABSOLUTE_ERROR AS FLOAT)) as plannedRoMAE
      FROM SETUP_TIME_MONITOR
      WHERE ACTUAL_START_DATE IS NOT NULL
        AND RECOMMENDED_ST_ABSOLUTE_ERROR IS NOT NULL
        AND NEW_ST_ABSOLUTE_ERROR IS NOT NULL
      GROUP BY 
        FORMAT(ACTUAL_START_DATE, 'yyyy-MM'),
        DATENAME(MONTH, ACTUAL_START_DATE),
        YEAR(ACTUAL_START_DATE),
        MONTH(ACTUAL_START_DATE)
      ORDER BY 
        YEAR(ACTUAL_START_DATE),
        MONTH(ACTUAL_START_DATE)
    `;

    const result = await executeQuery(query);

    // Format data for spark charts
    const numberOfPOData = result.recordset.map((row) => ({
      month: `${row.month} ${row.year}`,
      value: row.numberOfPO,
    }));

    const aimlRoMAEData = result.recordset.map((row) => ({
      month: `${row.month} ${row.year}`,
      value: Number(row.aimlRoMAE.toFixed(2)),
    }));

    const plannedRoMAEData = result.recordset.map((row) => ({
      month: `${row.month} ${row.year}`,
      value: Number(row.plannedRoMAE.toFixed(2)),
    }));

    return {
      numberOfPO: {
        data: numberOfPOData.map((d) => d.value),
        categories: numberOfPOData.map((d) => d.month),
        total: numberOfPOData.reduce((sum, d) => sum + d.value, 0),
      },
      aimlRoMAE: {
        data: aimlRoMAEData.map((d) => d.value),
        categories: aimlRoMAEData.map((d) => d.month),
        average: (
          aimlRoMAEData.reduce((sum, d) => sum + d.value, 0) / aimlRoMAEData.length
        ).toFixed(2),
      },
      plannedRoMAE: {
        data: plannedRoMAEData.map((d) => d.value),
        categories: plannedRoMAEData.map((d) => d.month),
        average: (
          plannedRoMAEData.reduce((sum, d) => sum + d.value, 0) /
          plannedRoMAEData.length
        ).toFixed(2),
      },
    };
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// Get monthly trends
const getMonthlyTrends = async () => {
  try {
    const query = `
      SELECT 
        DATENAME(MONTH, ACTUAL_START_DATE) as month,
        YEAR(ACTUAL_START_DATE) as year,
        COUNT(DISTINCT PROCESS_ORDER_NUMBER) as numberOfPO,
        AVG(CAST(RECOMMENDED_ST_ABSOLUTE_ERROR AS FLOAT)) as aimlRoMAE,
        AVG(CAST(NEW_ST_ABSOLUTE_ERROR AS FLOAT)) as plannedRoMAE
      FROM SETUP_TIME_MONITOR
      WHERE ACTUAL_START_DATE IS NOT NULL
        AND RECOMMENDED_ST_ABSOLUTE_ERROR IS NOT NULL
        AND NEW_ST_ABSOLUTE_ERROR IS NOT NULL
      GROUP BY 
        DATENAME(MONTH, ACTUAL_START_DATE),
        YEAR(ACTUAL_START_DATE),
        MONTH(ACTUAL_START_DATE)
      ORDER BY 
        YEAR(ACTUAL_START_DATE),
        MONTH(ACTUAL_START_DATE)
    `;

    const result = await executeQuery(query);
    return result.recordset;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// Get grouped metrics
const getGroupedMetrics = async (groupBy, selectedMonth, selectedGroups) => {
  try {
    // Validate groupBy to prevent SQL injection
    const validGroupByFields = [
      "SETUP_MATRIX",
      "FROM_SETUP_GROUP",
      "TO_SETUP_GROUP",
      "SEGEMENT",
      "BUSINESS_UNIT",
      "INTERFACE",
      "FLATFORM",
      "FACILITY_NAME",
      "MACHINE",
      "PACKER_RESOURCE",
    ];

    if (!validGroupByFields.includes(groupBy)) {
      throw new Error("Invalid groupBy field");
    }

    let whereClause =
      "WHERE RECOMMENDED_ST_ABSOLUTE_ERROR IS NOT NULL AND NEW_ST_ABSOLUTE_ERROR IS NOT NULL";
    const params = {};

    if (selectedMonth) {
      whereClause += ` AND FORMAT(ACTUAL_START_DATE, 'yyyy-MM') = @selectedMonth`;
      params.selectedMonth = selectedMonth;
    }

    // Get all available groups
    const allGroupsQuery = `
      SELECT DISTINCT ${groupBy} as groupName
      FROM SETUP_TIME_MONITOR
      ${whereClause}
      AND ${groupBy} IS NOT NULL
      ORDER BY ${groupBy}
    `;

    const allGroupsResult = await executeQuery(allGroupsQuery, params);
    const allAvailableGroups = allGroupsResult.recordset.map((row) => row.groupName);

    // Build the main query
    let mainQuery = `
      SELECT TOP 10
        ${groupBy} as groupName,
        AVG(CAST(RECOMMENDED_ST_ABSOLUTE_ERROR AS FLOAT)) as aimlRoMAE,
        AVG(CAST(NEW_ST_ABSOLUTE_ERROR AS FLOAT)) as plannedRoMAE,
        COUNT(*) as count,
        COUNT(DISTINCT PROCESS_ORDER_NUMBER) as processOrderCount
      FROM SETUP_TIME_MONITOR
      ${whereClause}
      AND ${groupBy} IS NOT NULL
    `;

    if (selectedGroups && selectedGroups.length > 0) {
      const groupPlaceholders = selectedGroups
        .map((_, idx) => `@group${idx}`)
        .join(",");
      mainQuery += ` AND ${groupBy} IN (${groupPlaceholders})`;
      selectedGroups.forEach((group, idx) => {
        params[`group${idx}`] = group;
      });
    }

    mainQuery += `
      GROUP BY ${groupBy}
      ORDER BY AVG(CAST(RECOMMENDED_ST_ABSOLUTE_ERROR AS FLOAT)) DESC
    `;

    const result = await executeQuery(mainQuery, params);

    return {
      groupedMetrics: result.recordset,
      allAvailableGroups: allAvailableGroups,
      totalGroupsCount: allAvailableGroups.length,
    };
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// Get trends grouped metrics
const getTrendsGroupedMetrics = async (groupBy, selectedGroups) => {
  try {
    // Validate groupBy to prevent SQL injection
    const validGroupByFields = [
      "SETUP_MATRIX",
      "FROM_SETUP_GROUP",
      "TO_SETUP_GROUP",
      "SEGEMENT",
      "BUSINESS_UNIT",
      "INTERFACE",
      "FLATFORM",
      "FACILITY_NAME",
      "MACHINE",
      "PACKER_RESOURCE",
    ];

    if (!validGroupByFields.includes(groupBy)) {
      throw new Error("Invalid groupBy field");
    }

    const params = {};

    // Get all available groups
    const allGroupsQuery = `
      SELECT DISTINCT ${groupBy} as groupName
      FROM SETUP_TIME_MONITOR
      WHERE RECOMMENDED_ST_ABSOLUTE_ERROR IS NOT NULL 
        AND NEW_ST_ABSOLUTE_ERROR IS NOT NULL
        AND ${groupBy} IS NOT NULL
      ORDER BY ${groupBy}
    `;

    const allGroupsResult = await executeQuery(allGroupsQuery);
    const allAvailableGroups = allGroupsResult.recordset.map((row) => row.groupName);

    // Determine which groups to fetch (top 2 by default or selected groups)
    let groupsToFetch = selectedGroups;

    if (!selectedGroups || selectedGroups.length === 0) {
      // Get top 2 groups by average error
      const top2Query = `
        SELECT TOP 2 ${groupBy} as groupName
        FROM SETUP_TIME_MONITOR
        WHERE RECOMMENDED_ST_ABSOLUTE_ERROR IS NOT NULL 
          AND NEW_ST_ABSOLUTE_ERROR IS NOT NULL
          AND ${groupBy} IS NOT NULL
        GROUP BY ${groupBy}
        ORDER BY AVG(CAST(RECOMMENDED_ST_ABSOLUTE_ERROR AS FLOAT)) DESC
      `;

      const top2Result = await executeQuery(top2Query);
      groupsToFetch = top2Result.recordset.map((row) => row.groupName);
    }

    // Build query for selected groups
    const groupPlaceholders = groupsToFetch
      .map((_, idx) => `@group${idx}`)
      .join(",");
    groupsToFetch.forEach((group, idx) => {
      params[`group${idx}`] = group;
    });

    const trendsQuery = `
      SELECT 
        ${groupBy} as groupName,
        DATENAME(MONTH, ACTUAL_START_DATE) as month,
        YEAR(ACTUAL_START_DATE) as year,
        AVG(CAST(RECOMMENDED_ST_ABSOLUTE_ERROR AS FLOAT)) as aimlRoMAE,
        AVG(CAST(NEW_ST_ABSOLUTE_ERROR AS FLOAT)) as plannedRoMAE,
        COUNT(DISTINCT PROCESS_ORDER_NUMBER) as processOrderCount,
        COUNT(*) as count
      FROM SETUP_TIME_MONITOR
      WHERE RECOMMENDED_ST_ABSOLUTE_ERROR IS NOT NULL 
        AND NEW_ST_ABSOLUTE_ERROR IS NOT NULL
        AND ${groupBy} IN (${groupPlaceholders})
      GROUP BY 
        ${groupBy},
        DATENAME(MONTH, ACTUAL_START_DATE),
        YEAR(ACTUAL_START_DATE),
        MONTH(ACTUAL_START_DATE)
      ORDER BY 
        ${groupBy},
        YEAR(ACTUAL_START_DATE),
        MONTH(ACTUAL_START_DATE)
    `;

    const result = await executeQuery(trendsQuery, params);

    // Group results by groupName
    const groupedTrendsMetrics = {};
    result.recordset.forEach((row) => {
      if (!groupedTrendsMetrics[row.groupName]) {
        groupedTrendsMetrics[row.groupName] = {
          groupName: row.groupName,
          trendData: [],
        };
      }
      groupedTrendsMetrics[row.groupName].trendData.push({
        month: row.month,
        year: row.year,
        aimlRoMAE: row.aimlRoMAE,
        plannedRoMAE: row.plannedRoMAE,
        processOrderCount: row.processOrderCount,
        count: row.count,
      });
    });

    return {
      groupedTrendsMetrics: Object.values(groupedTrendsMetrics),
      allAvailableGroups: allAvailableGroups,
      totalGroupsCount: allAvailableGroups.length,
    };
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

module.exports = {
  getAvailableMonths,
  getMetricCards,
  getMetricTrendsCards,
  getMonthlyTrends,
  getGroupedMetrics,
  getTrendsGroupedMetrics,
};
