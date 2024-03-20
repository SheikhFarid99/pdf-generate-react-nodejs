const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const body_parser = require('body-parser')
const mongoose = require('mongoose')
const order_model = require('./order_model')
const path = require('path')
const puppeteer = require("puppeteer")
const { invoice_template } = require('./invoice_template')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

dotenv.config()
app.use(cors())
app.use(body_parser.json())

app.post('/api/order', async (req, res) => {

    const { items, total_price, shipping_info } = req.body

    try {
        const order = await order_model.create({
            order_items: items,
            total_price,
            payment_method: shipping_info.payment_method,
            shipping_info: {
                name: shipping_info.name,
                email: shipping_info.email,
                district: shipping_info.district,
                sub_district: shipping_info.sub_district,
                address: shipping_info.address
            }
        })

        const browser = await puppeteer.launch({
            args: [
                "--disable-setuid-sandbox",
                "--no-sandbox",
                "--single-process",
                "--no-zygote",
            ],
            executablePath: puppeteer.executablePath()
        });

        const page = await browser.newPage();

        const html = invoice_template(order)

        await page.setContent(html, { awitUntil: 'domcontentloaded' })

        //const invoice_name = `${order.id}.pdf`
        //const dist = __dirname + `/./files/invoice/${invoice_name}`

        try {

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
            })

            const result = await page.pdf({
                format: 'A4',
                printBackground: true
            })

            let cld_upload_stream = cloudinary.uploader.upload_stream(
                {
                    folder: "pdf",
                    public_id: order.id
                },
                function (error, result) {
                    console.log(error);
                }
            );

            streamifier.createReadStream(result).pipe(cld_upload_stream);

            await browser.close()

        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: error.message });
        }

        return res.status(201).json({ order, message: "Order success" })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message })
    }
})

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await order_model.find({}).sort({ createdAt: -1 })
        return res.status(200).json({ orders })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

app.get('/api/order/:order_id', async (req, res) => {

    const { order_id } = req.params

    try {

        const order = await order_model.findById(order_id)

        return res.status(200).json({ order })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

app.get('/api/invoice/download/:order_id', async (req, res) => {

    const { order_id } = req.params

    //const file = __dirname + `/./files/invoice/${order_id}.pdf`
    const file = `https://res.cloudinary.com/dpj4vsqbo/image/upload/v1710850049/pdf/${order_id}.pdf`

    // res.set({
    //     "Content-Type": 'application/pdf',
    //     "Content-Length": file.length
    // })
    // res.sendFile(file)
    return res.status(200).json({ url: file })

})

const db_connect = async () => {
    try {
        await mongoose.connect(process.env.db)
        console.log('database connect....')
    } catch (error) {
        console.log(error)
    }
}

db_connect()

app.use('/files', express.static(path.join(__dirname, '/files')));

app.use(express.static(path.join(__dirname, "./client/dist")))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "./", "client", "dist", "index.html"))
})

const port = process.env.port
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))