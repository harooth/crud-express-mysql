import express from "express";
import mysql from "mysql";


const PORT = process.env.PORT || 3001;

let app = express();
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({
	extended: true
}))

/**
 * 
 * @param {"const obj"} res - The response object, just pass it to the function
 * @param {string} query - The query to the database
 * @param {array} params - Array of parameters containing values to the query string
 * @param {function} funcOK - Callback function when there is no error
 */
function requestToDatabase(res, query, params, funcOK) {
	const conn = mysql.createConnection({
		host: process.env.HOST,
		user: process.env.USER,
		database: process.env.DATABASE,
		password: process.env.PASSWORD
	})
	conn.connect(err => {
		if (err) {
			return res.status(500).send({
				statusCode: 500,
				msg: "Database connection error"
			})
		}
		conn.query(query, params, (err, result, fields) => {
			// console.log(params)
			if (err) {
				return res.status(500).send({
					statusCode: 500,
					msg: "Database error"
				})
			}
			// res.send(result);
			// console.log(params)
			// if(params !== 0) {}
			funcOK(result)
		})
		conn.end()
	})
}

app.get("/", (req, res) => {
	res.redirect('index.html')
})


app.get("/all", (req, res) => {
	const query = "SELECT * FROM test";
	requestToDatabase(res, query, 0, function (data) {
		res.send(data);
		// setTimeout(()=>{
		// 	res.send(data);
		// }, 5000)
	})
})

app.get("/single/:id", (req, res) => {
	const query = "SELECT * FROM test WHERE id = ?";
	const params = [req.params.id]

	requestToDatabase(res, query, params, function (data) {
		if (params !== 0 && data.length == 1) {
			res.send(data)
		} else {
			res.status(400).send({ msg: "400 Bad request" })
		}
	})
})

app.post("/create", (req, res) => {
	let { name, email, password } = req.body;
	let query = "INSERT INTO test(name, email, password) VALUES (?, ?, ?)";
	let params = [name, email, password];
	requestToDatabase(res, query, params, data => {
		res.send(data)
	})
})

app.delete("/delete/:id", (req, res) => {
	let query = "DELETE FROM test WHERE id = ?";
	let params = [req.params.id];
	requestToDatabase(res, query, params, data => {
		res.send(data)
	})
})

app.put("/update/:id", (req, res) => {
	let { name, email, password } = req.body;
	let query = "UPDATE test SET name = ?, email = ?, password = ? WHERE id = ?";
	let params = [name, email, password, req.params.id];
	requestToDatabase(res, query, params, data => {
		res.send(data)
	})
})








app.get("/delay", (req, res) => {
	setTimeout(() => {
		return res.send({ "msg": "delay response" });
	}, 5000)
	// res.send({"resp": "ok"})
})





app.get("/:other", (req, res) => {
	res.send("Wrong path")
})

// app.listen(process.env.PORT)
app.listen(PORT, 'localhost', function () {
	console.log("Server is running on https://localhost:%d, rs-restart server", PORT);
}); 