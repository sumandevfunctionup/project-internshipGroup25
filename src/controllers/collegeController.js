const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")


const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true;
}

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}

const createCollege = async function (req, res) {
  try {
    let requestBody = req.body
    if (!isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college detalls' })

    }
    let { name, fullName, logoLink } = requestBody

    //  checking if any data field is empty or has no value
    if (!isValid(name)) return res.status(400).send({ status: false, msg: 'please provide name' })
    if (!isValid(fullName)) return res.status(400).send({ status: false, msg: 'please provide full name' })
    if (!isValid(logoLink)) return res.status(400).send({ status: false, msg: 'please provide logo link' })

    //checking name is taken or not

    const nameCheck = await collegeModel.findOne({ name })
    if (nameCheck) return res.status(400).send({ status: false, message: 'name is already used' })

    const createCollege = await collegeModel.create(requestBody)

    res.status(201).send({ status: true, message: "Created Successfully", data: { name: createCollege.name, fullName: createCollege.fullName, logoLink: createCollege.logoLink,isDeleted:createCollege.isDeleted } })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
  }
}
module.exports.createCollege = createCollege


//---------------------------------------------------------------------------------------------------------------------//

