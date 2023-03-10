import express from "express";
import mysql from "mysql";

let app = express();
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({
	extended: true
}))

function connection() {
	const conn = mysql.createConnection({
		host: process.env.HOST,
		user: process.env.USER,
		database: process.env.DATABASE,
		password: process.env.PASSWORD
	})	
	return conn;
} 
 
app.get("/", (req, res) => {
	const conn = connection();
	conn.connect(err=>{ 
		if(err){
			res.status(500).send("db error")
		} else {
			console.log("ok a db-n")
			res.redirect("nn.html");
		}
	})
	conn.end();
	
})



app.get("/sql", (req, res) => {
	let conn = connection();
	conn.connect(err=>{
		// if()
		let query = "SELECT * FROM test";
		conn.query(query, (err, result, fields) => {
			res.send(result);
		})
		conn.end()
	})
	
})

app.get("/sql/:id", (req, res) => {
	let conn = connection();
	let query = "SELECT * FROM test WHERE id = ?";
	conn.query(query, [req.params.id], (err, result, fields) => {
		// res.send(result);
		if (result.length == 0) {
			res.status(404).send("Error 404")
		}
		else {
			res.send(result)
		}
	})
	conn.end()
})

app.post("/sql", (req, res) => {
	let { name, email, password } = req.body;
	let conn = connection();
	let query = "INSERT INTO test(name, email, password) VALUES (?, ?, ?)";
	conn.query(query, [name, email, password], (err, result) => {
		// console.log(err)
		// console.log(res);
		res.send("Inserted")
		// res.redirect("/")
	})
	conn.end()
})

app.delete("/sql/:id", (req, res) => {
	let conn = connection();
	let query = "DELETE FROM test WHERE id = ?";
	conn.query(query, [req.params.id], (err, result) => {
		console.log(result)
		res.send({
			msg: "Deleted"
		})
		conn.end()
	})
})

app.put("/sql/:id", (req, res) => {
	let {name, email, password} = req.body;
	console.log(req.body)
	let conn = connection();
	let query = "UPDATE test SET name = ?, email = ?, password = ? WHERE id = ?";
	conn.query(query, [name, email, password, req.params.id], (err, result) => {
		res.send("Updated successfully!")
		conn.end()
	})
})

app.get("/:el", (req, res) => {
	res.send("Wrong path")
})



app.listen(process.env.PORT)