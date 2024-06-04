const { Parser } = require("node-sql-parser");
const parser = new Parser();

const { tableList, columnList, ast } = parser.parse(
  "INSERT INTO tabela(ds_arquivo, coluna1, coluna2) values ('teste.csv', 'valor1', 'valor2')",
);

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

const tableName = parseName(tableList[0]);
const operation = parseOperation(tableList[0]).toUpperCase();
const columns = buildColumnsAndValues(columnList, ast.values[0].value);

console.log(`this.sql = await this.maxysService.insert({
                  table: "${tableName},
                  operationType: "${operation}",
                  columns: ${JSON.stringify(columns)}
                });
                `);