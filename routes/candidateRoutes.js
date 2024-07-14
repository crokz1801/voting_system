const express = require("express");
const router = express.Router();
const {jwtAuthMidWare,generateToken } = require('./../jwt');
const candidate = require("./../models/candidate");
const user = require("../models/user");
// const user = require("../models/user");

const checkAdminRole = async(userId)=>{
try{
    const user1 = await user.findById(userId);
    if(user1.role === 'admin') return true;

}catch(err){
    console.log('false');
            return false; 
}
}
router.post("/",jwtAuthMidWare, async (req, res) => {
    try {

        if( ! await checkAdminRole(req.user.id)){
            return res.status(403).json({message:'invalid admin role'});
        }


      const data = req.body;
      const newCandidate = new candidate(data);

      const response = await newCandidate.save();
      console.log("data successfully saved");

  
      res.status(200).json({response : response});
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: "internal server error" });
    }
  });
  

  
  router.put("/:candidateId",jwtAuthMidWare, async (req, res) => {
    try {
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message:'invalid admin role'});
        }
        const candidateId = req.params.candidateId;
        const updatedData = req.body;
    
        const response = await person.findByIdAndUpdate(candidateId, updatedData, {
          new: true,
          runValidators: true,
        });
    
        if (!response) {
          return res.status(403).json({ error: "person not found" });
        }
    
        console.log("data updated !");
        res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  

  
router.delete("/:candidateId",jwtAuthMidWare, async (req, res) => {
    try {

        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message:'invalid admin role'});
        }
        const candidateId = req.params.candidateId;
    
        const response = await person.findByIdAndDelete(candidateId);
    
        if (!response) {
          return res.status(403).json({ error: "person not found" });
        }
    
        console.log("data deleted !");
        res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  router.post('/vote/:candidateId',jwtAuthMidWare,async(req,res)=>{
     candidateId = req.params.candidateId;
     userId = req.user.id;

     try{
      const candidate1 = await candidate.findById(candidateId);
      if(!candidate1){
        return res.status(404).json({message:'candidate not found'});
      }

      const user1 = await user.findById(userId);
      if(!user1){
        return res.status(404).json({message:'user not found'});

      }
      if(user1.isVoted){
        return res.status(404).json({message:'you have already voted'});
      }

      if(user1.role ==='admin'){
        return res.status(404).json({message: 'admin is not allowed'});
      }

      candidate1.votes.push({user:userId});
      candidate1.voteCount++;
      await candidate1.save();


      user1.isVoted = true;
      await user1.save();

      res.status(200).json({message:'vote recorded successfully'});
     }catch(err){
      console.log(err);
      res.status(500).json(err);

     }
  });


  router.get('/vote/count',async(req,res)=>{
    try{
      const candidate1 = await candidate.find().sort({voteCount:'desc'});

      const record = candidate1.map((data)=>{
        return{
          party:data.party,
          count: data.voteCount
        }
      });
      return res.status(200).json(record);
    }catch(err){
      console.log(err);
      res.status(500).json(err);
    }
  })

  module.exports = router;