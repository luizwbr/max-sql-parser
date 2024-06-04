const { Parser } = require("node-sql-parser");
const parser = new Parser();



/**
 * Parses the operation from the given SQL string.
 *
 * @param {string} sql - The SQL string to parse.
 * @returns {string} The parsed operation.
 */
function parseOperation(sql) {
  return sql.split("::")[0];
}

/**
 * Parses the name from the given SQL string.
 *
 * @param {string} sql - The SQL string to parse.
 * @returns {string} The parsed name.
 */
function parseName(sql) {
  return sql.split("::")[2];
}

/**
 * Builds an array of objects containing column names and corresponding values.
 *
 * @param {Array<string>} columnList - The list of column names.
 * @param {Array<{ value: any }>} values - The list of values.
 * @returns {Array<{ name: string, value: any }>} - The array of objects containing column names and values.
 */
function buildColumnsAndValues(columnList, values) {
  return columnList.map((item, key) => {
    const columnName = parseName(item);
    return {
      name: columnName,
      value: values[key].value,
    };
  });
}



const express = require('express')
const app = express()
const port = 3000;

app.get('/', (req, res) => {

    const sql = req.query?.sql || '';

    if (sql === '') {
        res.send('SQL is required');
        return;
    }


    try {
        const { tableList, columnList, ast } = parser.parse(sql);
        const tableName = parseName(tableList[0]);
        const operation = parseOperation(tableList[0]).toUpperCase();
        const columns = buildColumnsAndValues(columnList, ast.values[0].value);
        
        const result = `this.sql = await this.maxysService.insert({
                          table: "${tableName},
                          operationType: "${operation}",
                          columns: ${JSON.stringify(columns)}
                        });
        `;
        
        res.send(result);
    } catch (error) {
        res.send(error.message);
    };
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})