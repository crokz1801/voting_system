const express = require("express");
const router = express.Router();
const {jwtAuthMidWare,generateToken } = require('./../jwt');
const user = require("./../models/user");


router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const newUser = new user(data);

    const response = await newUser.save();
    console.log("data successfully saved");

    const payLoad = {
      id: response.id
    }


    console.log(JSON.stringify(payLoad));
    const token = generateToken(payLoad);
    console.log('token is: ',token)

    res.status(200).json({response : response , token:token});

  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "internal server error" });
  }
});

router.post('/login',async(req,res)=>{

  try{
    const {aadharNo,password} = req.body;

  const user = await user.findOne({aadharNo: aadharNo});


  if(!user || !(await user.comparePassword(password))){
    return res.status(401).json({error: 'invalid Aadhar No or password !!!'});
  }

  const payload ={
    id:user.id
  }
  const token = generateToken(payload);

  res.json({token})
  }catch(err){
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
  
})

router.get('/profile',jwtAuthMidWare, async(req,res)=>{
  try{
    
   
    const userData = req.user;
    console.log("user Data :",userData);

    const userId = userData.id;
    const user = await person.findById(userId);
    

    res.status(200).json(user);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
})



router.put("/profile/password",jwtAuthMidWare, async (req, res) => {
  try {
    const userId = req.user;
    const {currentPassword,newPassword} = req.body;
    
    const user = await user.findById(userId);


    if( !(await user.comparePassword(currentPassword))){
      return res.status(401).json({error: 'invalid Aadhar No or password !!!'});
    }

    user.password = newPassword;
    await user.save();

    console.log("password updated !");
    res.status(200).json({message: 'password changed !'});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
