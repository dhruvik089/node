const express = require("express");

const app = express();
const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'sit@123',
    server: '182.70.118.201', // IP address or hostname of SQL Server instance
    port: 1580,
    database: 'GameReward_0415',
    options: {
        encrypt: false // If you're on Windows Azure, set to true
    }
};


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


app.delete('/api/delete/:id', async (req, res) => {
    try {
        await sql.connect(config)
        let userId = parseInt(req.params.id);

        await new sql.Request().query(
            `    
            delete from Registration where user_id=${userId};
`
        );
        console.log("delete")
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await sql.close();
    }

});

app.put("/api/update/:id", async (req, res) => {
    try {
        await sql.connect(config);
        const userId = parseInt(req.params.id)
        const { name,emails }=req.body;

        console.log(name)
        console.log(emails)
        console.log(userId)

        await new sql.Request().query(
            `
                update Registration set name='${name}' ,email='${emails}' where user_id='${userId}'
            `
        )
        let result=await new sql.Request().query(
            `
                select * from registration
            `)

            console.log(result)
    }
    catch (err) {
        console.log(err);
    }
    finally {
        await sql.close();
    }
})

app.post('/api/users', async (req, res) => {
    try {
        await sql.connect(config)

        const { name, emails, password } = req.body;
        console.log(name);
        console.log(emails);
        console.log(password);

        await new sql.Request().query(
            `
    INSERT INTO Registration (name, email, password)
    VALUES ('${name}', '${emails}', '${password}')
`
        );

    }
    catch (err) {
        console.log(err)
    }
    finally {
        await sql.close();
    }
});

app.listen(8080, () => {
    console.log("port start on 8080");
})