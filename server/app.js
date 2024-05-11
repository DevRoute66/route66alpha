const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Importando o bcryptjs
app.use(express.json());
const cors = require("cors");
app.use(cors(
  {
    origin: ["https://route66alpha-ym2h.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true
  }
             
));

const jwt=require("jsonwebtoken");

const JWT_SECRET= "kdskhwrbfbw$%86nfdbgdhbbfb9375nbdhwbvb%$¨$hfelsnj@hskjfnf-mgfnehgvrhtgrhg>ncvg"

const mongoUrl = "mongodb+srv://route66company:fv2507@cluster0.lqb3tgg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
}).then(() => {
  console.log("Connected to database");
}).catch(e => console.log(e));

require("./userDetails");

const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
  const { fname, lname, email, password } = req.body;
  
  try {
    // Verificar se o e-mail já está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "E-mail already registered" });
    }
    
    // Criptografar a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Criar novo usuário
    await User.create({
      fname,
      lname,
      email,
      password: hashedPassword, // Salvar senha criptografada
    });
    res.send({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not Found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET);

    if (res.status(201)) {
      return res.json({ status: "ok", data: token});
    } else {
      return res.json({ error: "error" });
    }
  }
  res.jason({ status: "error", error: "Invalid Password"});
});

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    console.log(user);

    const usermail = user.email;
    User.findOne({ email: usermail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {
    // Aqui você pode lidar com erros de verificação do token
    res.send({ status: "error", data: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server Started");
});
