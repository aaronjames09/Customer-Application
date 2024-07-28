const express = require('express');
const cors = require('cors');
const client = require('./connection.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


const app = express();
const PORT = 3001;

app.use(cors()); // Add this line to enable CORS
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

client.connect();

// app.get('/customers', async (req, res) => {
//     try {
//         const { page = 1, limit = 20, customer_name, customer_location } = req.query;
//         const offset = (page - 1) * limit;

//         let query = `SELECT * FROM customer_data_tbl`;
//         let values = [];
//         let counter = 1;

//         if (customer_name) {
//             query += ` WHERE customer_name ILIKE $${counter}`;
//             values.push(`%${customer_name}%`);
//             counter++;
//         }

//         if (customer_location) {
//             query += customer_name ? ` AND` : ` WHERE`;
//             query += ` customer_location ILIKE $${counter}`;
//             values.push(`%${customer_location}%`);
//             counter++;
//         }

//         query += ` LIMIT $${counter} OFFSET $${counter + 1}`;
//         values.push(limit, offset);

//         const result = await client.query(query, values);
//         res.json(result.rows);
//     } catch (err) {
//         console.error('Error fetching data:', err);
//         res.status(500).send('Server error');
//     }
// });

app.get('/customers', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, sortField, sortOrder } = req.query;
        const offset = (page - 1) * limit;

        let query = `SELECT *, to_char(created_at, 'YYYY-MM-DD') AS date, to_char(created_at, 'HH24:MI:SS') AS time FROM customer_data_tbl`;
        let countQuery = `SELECT COUNT(*) FROM customer_data_tbl`;
        let values = [];
        let counter = 1;

        if (search) {
            query += ` WHERE customer_name ILIKE $${counter} OR customer_location ILIKE $${counter}`;
            countQuery += ` WHERE customer_name ILIKE $${counter} OR customer_location ILIKE $${counter}`;
            values.push(`%${search}%`);
            counter++;
        }

        if (sortField) {
            query += ` ORDER BY ${sortField} ${sortOrder}`;
        }

        query += ` LIMIT $${counter} OFFSET $${counter + 1}`;
        values.push(limit, offset);

        // Fetch data
        const dataResult = await client.query(query, values);

        // Fetch total count
        const countResult = await client.query(countQuery, values.slice(0, -2)); // Exclude limit and offset from count query

        res.json({
            data: dataResult.rows,
            totalRecords: parseInt(countResult.rows[0].count, 10)
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Server error');
    }
});



app.get('/customer/name/:customer_name', async (req, res) => {
    try {
        const { customer_name } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const query = `SELECT * FROM customer_data_tbl WHERE customer_name ILIKE $1 LIMIT $2 OFFSET $3`;
        const values = [`%${customer_name}%`, limit, offset];
      
        const result = await client.query(query, values);
        if(result.rows.length === 0)
        {
            console.log(`No such customer exist`)
        }

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Server error');
    }
});

app.get('/customer/location/:customer_location', async (req, res) => {
    try {
        const { customer_location } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const query = `SELECT * FROM customer_data_tbl WHERE customer_location ILIKE $1 LIMIT $2 OFFSET $3`;
        const values = [`%${customer_location}%`, limit, offset];

        const result = await client.query(query, values);
        if(result.rows.length === 0)
            {
                console.log(`No such customer location exist`)
            }
    
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Server error');
    }
});