const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createPool({
    host: 'localhost',
    user: 'root',  
    password: '',     
    database: 'lebanongen'
});

app.post('/add-case', (req, res) => {
    const sql = "INSERT INTO genetic_cases (husband_first_name, husband_last_name, wife_first_name, wife_last_name, husband_region, wife_region, husband_history, wife_history, husband_status, wife_status, risk_result) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.wifefirstName,
        req.body.wifelastName,
        req.body.husbandRegion,
        req.body.wifeRegion,
        req.body.HusbandfamilyHistory,
        req.body.WifefamilyHistory,
        req.body.husbandStatus,
        req.body.wifeStatus,
        req.body.riskResult
    ];

    db.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json("Success");
    });
});
//Bar Chart
app.get("/region-status-stats", (req, res) => {

const sql = `
SELECT region,
SUM(carrier) as carriers,
SUM(infected) as infected
FROM (
    SELECT husband_region as region,
    (husband_status='carrier') as carrier,
    (husband_status='infected') as infected
    FROM genetic_cases

    UNION ALL

    SELECT wife_region as region,
    (wife_status='carrier') as carrier,
    (wife_status='infected') as infected
    FROM genetic_cases
) as combined
GROUP BY region
`;

db.query(sql,(err,result)=>{
if(err){
console.log(err);
return res.status(500).json(err);
}

res.json(result);
});

});


//Pie Chart
app.get("/genetic-distribution", (req,res)=>{

const sql = `
SELECT status, COUNT(*) as total
FROM (
  SELECT husband_status as status FROM genetic_cases
  UNION ALL
  SELECT wife_status as status FROM genetic_cases
) as statuses
GROUP BY status
`;

db.query(sql,(err,result)=>{
if(err){
console.log(err);
return res.status(500).json(err);
}

res.json(result);
});

});

app.listen(8081, () => {
    console.log("Server running on port 8081");
});