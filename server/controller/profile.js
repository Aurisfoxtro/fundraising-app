import express from 'express'
import Joi from 'joi'
import multer from 'multer'
import{access, mkdir} from 'fs/promises'
import validator from '../middleware/validator.js'
import auth from '../middleware/authentication.js'
import { exists, insert, getAll, getById, getByUserId, update, getApproved, remove, insertDonation } from '../service/profile.js'
// import {insert as portfolioInsert, getAll as portfolioItems} from '../service/portfolio.js'
import {insert as portfolioInsert, getAll as profileHistory} from '../service/donations.js'
import {Op} from 'sequelize'

const Router = express.Router()

const diskStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const path = './uploads/' //+ req.body.UserId
        try{
            await access(path)
        }catch{
            await mkdir(path, {recursive: true})
        }
        cb(null, path)      
    },
    // filename: function (req, file, cb) {
        
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
    // }
    filename: (req, file, callback) => {
        const ext = file.originalname.split('.')
 
        callback(null, Date.now() + '.' + ext[1])
    }
  })

  const upload = multer({
    storage: diskStorage,
    fileFilter: (req, file, callback) => {
        //Atliekamas failu formato tikrinimas
        if(
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/gif'
        ) {
            callback(null, true)
        } else {
            callback(null, false)
        }
    }
})

//   const upload = multer({ storage: storage })

const profileSchema = (req, res, next) =>{
    const schema = Joi.object({
        // headline: Joi.string(),
        // subheadline: Joi.string(),
        description: Joi.string(),
        target_sum: Joi.number(),
        approved: Joi.number(),
        success: Joi.number()
        //funded_sum: Joi.number()
        // hourly_rate: Joi.number().required(),
        // location: Joi.string(),
        // UserId: Joi.number().required()
    })

    validator(req, next, schema)
}

const donationSchema = (req, res, next) =>{
    const schema = Joi.object({
        // headline: Joi.string(),
        // subheadline: Joi.string(),
        donator: Joi.string(),
        donation: Joi.number()
        //funded_sum: Joi.number()
        // hourly_rate: Joi.number().required(),
        // location: Joi.string(),
        // UserId: Joi.number().required()
    })

    validator(req, next, schema)
}

Router.get('/', async(req,res)=>{
    const profiles = await getAll()
    if(profiles){
        res.json({message: profiles, status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

Router.get('/approved', async(req,res)=>{
    const profiles = await getApproved()
    if(profiles){
        res.json({message: profiles, status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

Router.get("/history/:id", async (req, res) =>{
    const id = req.params.id; // Ar nereiks splitinti, kad panaikinti ":"
    let entries = await getById(id);
    if(entries){
        const history = await profileHistory(entries.id);
        res.json({status: "success", message: history});
    }else{
        res.json({status: "danger", message: "Nepavyko surasti profilio"})
    }
})

Router.get('/sort/asc', async(req,res)=>{
    const profiles = await getAll({
        order: [
            ['headline', 'ASC']
        ]
    })
    if(profiles){
        res.json({message: profiles, status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

Router.get('/sort/desc', async(req,res)=>{
    const profiles = await getAll({
        order: [
            ['headline', 'DESC']
        ]
    })
    if(profiles){
        res.json({message: profiles, status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

Router.get('/filter/hourly_rate/:rate', async(req,res)=>{
    const rate = req.params.rate
    const profiles = await getAll({
        where: {
            hourly_rate: {
                [Op.gte]: rate
            }
        }
    })
    if(profiles){
        res.json({message: profiles, status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

Router.get('/single/:id', async (req, res)=>{
    const id = req.params.id
    const profile = await getById(id)
    if(profile){
        const portfolio = await portfolioItems(profile.id)
        if(portfolio)
            profile.portfolio = portfolio[0].dataValues
        res.json({message: profile, status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

const profileFileFields = upload.fields([
    {name: 'profile_image', maxCount: 1}
    // ,
    // {name: 'portfolio_items', maxCount: 20}
]) 

Router.post('/create', profileFileFields, profileSchema, async (req, res) =>{
    // console.log(req.body)

    if(await exists({
        UserId: req.body.UserId
    })){
        res.json({status: 'danger', message: 'Profilis šiam vartotojui jau sukurtas'})
        // return
    }else{
        if(req.files.profile_image){
            let image = req.files.profile_image[0]
            let path = image.path.replaceAll('\\', '/') 
            req.body.profile_image = path
        }
        let ProfileId = false
        if(ProfileId = await insert(req.body)){
            // req.files.portfolio_items.map(async image=> {
            //     let path = image.path.replaceAll('\\', '/') 
            //     await portfolioInsert({image_url: path, ProfileId})
            // })
            res.json({status: 'success', message: 'Profilis sėkmingai sukurtas'})
        }else{
            res.json({status: 'danger', message: 'Įvyko klaida'})
        }
    } 
})

Router.post('/donate/:id', donationSchema, async (req, res) =>{
    // console.log(req.body)
    const profileId = req.params.id
    const splitProfileId = profileId.split(":")
    console.log("splitProfileId: ", splitProfileId)
    console.log("ProfileID: ", profileId)
    console.log("req.body: ", await req.body)
    const data = await req.body
    data.ProfileId = splitProfileId[1]
    console.log("DATA: ", data)
    // if(await exists({
    //     UserId: req.body.UserId
    // })){
    //     res.json({status: 'danger', message: 'Profilis šiam vartotojui jau sukurtas'})
    //     // return
    // }else{
        // if(req.files.profile_image){
        //     let image = req.files.profile_image[0]
        //     let path = image.path.replaceAll('\\', '/') 
        //     req.body.profile_image = path
        // }
        // let ProfileId = false
        // if(ProfileId = await insert(req.body)){
        try{
            await insertDonation(data)
            // req.files.portfolio_items.map(async image=> {
            //     let path = image.path.replaceAll('\\', '/') 
            //     await portfolioInsert({image_url: path, ProfileId})
            // })
            res.json({status: 'success', message: 'Auka sėkmingai priskirta'})
        }catch{
            res.json({status: 'danger', message: 'Įvyko klaida'})
        } 
})

Router.get('/edit/:user_id', auth, async (req, res)=>{
    const user_id = req.params.user_id
    const profile = await getByUserId(user_id)
    if(profile){
        const portfolio = await portfolioItems(profile.id)
        if(portfolio)
            profile.portfolio = portfolio
        res.json({message: profile, status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

Router.put('/update/:id', auth, profileSchema, async (req, res)=>{
    const id = req.params.id
    const profile = req.body
    try{
        await update(id, profile)
        // const portfolio = await portfolioItems(profile.id)
        // if(portfolio)
        //     profile.portfolio = portfolio
        res.json({message: "Profilis sėkmingai atnaujintas", status: 'success'})
    }catch{
        res.json({message: 'Profilis nebuvo atnaujintas', status: 'danger'})
    }
})

Router.delete('/delete/:id', async (req, res)=>{
    const id = req.params.id
    // console.log("ID: ", id)
    // const profile = req.body
    try{
        await remove(id)
        // const portfolio = await portfolioItems(profile.id)
        // if(portfolio)
        //     profile.portfolio = portfolio
        res.json({message: "Profilis sėkmingai ištrintas", status: 'success'})
    }catch{
        res.json({message: 'Profilis nebuvo ištrintas', status: 'danger'})
    }
})

Router.put('/update/', auth, profileSchema, async (req, res)=>{
    const user_id = req.body.UserId  //Paimame userio id is perduodamos informacijos
    const profile = await getByUserId(user_id) //susirandam profilio informacija pagal userio id

    if(await update(profile.id, req.body)){
        res.json({message: 'Profilis sėkmingai atnaujintas', status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

export default Router