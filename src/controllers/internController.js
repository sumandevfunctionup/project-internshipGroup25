const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")


const isValid = function (value) {
  if (typeof (value) === 'undefined' || typeof (value) === 'null') {
    return false
  }
  if (value.trim().length == 0) {
    return false
  } if (typeof (value) === 'string' && value.trim().length > 0) {
    return true
  }
}

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}

const createIntern = async function (req, res) {
  try {
    const requestBody = req.body

    if (!isValidRequestBody(requestBody)) {
     return  res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college detalls' })
    }

    const { name, email, mobile, collegeName } = requestBody
  
    const finalQuery = {}
    finalQuery["name"] = name
    finalQuery["email"] = email
    finalQuery["mobile"] = mobile

    //validation from input
    if (!isValid(name)) {
     return  res.status(400).send({ status: false, message: 'please enter name' })
    }
    if (!isValid(email)) {
     return  res.status(400).send({ status: false, message: 'please enter email' })
    }
    if (!mobile) {
    return  res.status(400).send({ status: false, message: 'please enter mobile' })
    }
    if (!isValid(collegeName)) {
     return res.status(400).send({ status: false, message: 'please enter collegename' })
    }

    //validation for email
    const emailRegex = /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-z]+)$/;


    if (!emailRegex.test(email.trim())) {
      return res.status(400).send({
        status: false, message: `${email} is not a valid email`,
      })
    }

    //checking email  already used or not 
    const checkEmail = await internModel.findOne({ email, isDeleted: false });
    if (checkEmail) {
      return res.status(400).send({ status: false, message: `${email} is already registered` });
    }

    //mobile validation
    const mobileRegex = /^([0-9]){10}$/;

    if (!mobileRegex.test(mobile)) {
      return res.status(400).send({
        status: false, message: `${mobile} is not a valid mobile number`,
      });
    }
    //checking number  already used or not 
    const checkNumber = await internModel.findOne({ mobile: mobile, isDeleted: false });
    if (checkNumber) {
      return res.status(400).send({ status: false, message: `${mobile} is already registered` });
    }


    // checking collegeName exist or not 
    const findCollegeId = await collegeModel.findOne({ name: collegeName, isDeleted: false })
    if (!findCollegeId) {
     return res.status(404).send({ status: false, message: "no college found" })
    }
    
    const collegeId = findCollegeId._id
    finalQuery["collegeId"] = collegeId

    const internCreation = await internModel.create(finalQuery)


    res.status(201).send({ status: true, message: "successfully created", data:{isDeleted:internCreation.isDeleted,name:internCreation.name,email:internCreation.email,mobile:internCreation.mobile,collegeId:internCreation.collegeId}})

  } catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
}
module.exports.createIntern = createIntern



  //------------------------------------------------------------------------------------------------------------------------------//



  const collegeDetails = async function (req, res) {
    try {
  
      const queryParams = req.query
      if (!queryParams) {
        return res.status(400).send({ status: false, message: "'Invalid request parameters. Please provide details' " })
      }
      const collegeName = req.query.collegeName
      if (!isValid(collegeName)) {
        return res.status(400).send({ status: false, message: "'Invalid request parameters. Please provide collegeName' " })
      }
  
      // checking collegeName exist or not
      const details = await collegeModel.findOne({ name: collegeName, isDeleted: false })
      if (!details) {
        return res.status(400).send({ status: false, message: "please provide valid collegeName" })
      }
      console.log(details)
      const collegeId = details._id
      const internDetails = await internModel.find({ collegeId: collegeId, isDeleted: false }).select({ createdAt: 0, updatedAt: 0, __v: 0, isDeleted: 0, collegeId: 0 })
      const finalData = {
        "name": details.name,
        "fullName": details.fullName,
        "logoLink": details.logoLink,
        "interests": internDetails
      }
      if (internDetails.length == 0) {
        finalData["interests"] = "no student found"
  
      }

      res.status(200).send({ status: true, data: finalData })
  
  
    } catch (error) {
      res.status(500).send({ status: false, message: error.message })
    }
  
  }
  module.exports.collegeDetails = collegeDetails 
