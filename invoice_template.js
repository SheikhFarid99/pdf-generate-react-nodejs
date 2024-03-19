const moment = require('moment')
module.exports.invoice_template = (order) => {

    const html = `<html lang="en">

    <head>
        <meta charset="UTF-8">
        <title>Document</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&family=Urbanist:wght@100&display=swap"
            rel="stylesheet">
        <style type="text/css">
            * {
                font-family: "Roboto", sans-serif;
                margin: 0;
                box-sizing: border-box;
                padding: 0;
            }
    
            .main-content {
                width: 100%;
                padding: 24px;
                height: 100%;
                background-color: white;
            }
    
            .logo-title {
                display: flex;
                justify-content: space-between;
            }
    
            .logo {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                row-gap: 8px;
            }
    
            .logo img {
                width: 130px;
                height: 90px;
            }
    
            .logo h2 {
                font-size: 20px;
                font-weight: 600;
                color: rgb(59 130 246 /1);
            }
    
            .invoice-info {
                display: flex;
                justify-content: flex-end;
                row-gap: 20px;
                flex-direction: column;
            }
    
            .invoice-info h2 {
                font-size: 30px;
                text-align: end;
                font-weight: 600;
                color: rgb(59 130 246 /1);
                text-transform: uppercase;
            }
    
            .invoice-info .info {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                column-gap: 40px;
            }
    
            .info .title {
                display: flex;
                justify-content: flex-end;
                flex-direction: column;
                row-gap: 5px;
            }
    
            .info .title h1 {
                font-size: 16px;
                font-weight: 600;
                text-align: end;
            }
    
            .info .title span {
                text-align: end;
                font-size: 16px;
            }
        </style>
    
    </head>
    
    <body>
            <div class='main-content '>
                <div class='logo-title'>
                    <div class='logo'>
                        <img src="http://localhost:5000/files/logo.png" alt="" />
                        <h2>Learn with Project</h2>
                    </div>
                    <div class='invoice-info'>
                        <h2>INvoice</h2>
                        <div class='info'>
                            <div class='title'>
                                <h1 class='text-md font-semibold text-end'>Invoice No:</h1>
                                <h1 class='text-md font-semibold text-end'>Invoice Date:</h1>
                                <h1 class='text-md font-semibold text-end'>Purchase Order:</h1>
                            </div>
                            <div class='title'>
                            <span className='text-end'>${Math.random().toString(36).substring(2, 9).toLocaleUpperCase()}</span>
                            <span className='text-end'>${moment(order.createdAt).format('LL')}</span>
                            <span className='text-end'>${Math.random().toString(36).substring(2, 9).toLocaleUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div style="padding: 20px;">
                    <div style="margin-top: 32px;" class='mt-8'>
                        <div style="display: flex; justify-content: flex-start;flex-direction: column; row-gap: 4px;">
                            <h2 style="font-size: 20px; font-weight: 600;" class='text-xl font-semibold' >${order.shipping_info?.name}</h2>
                            <span>District: ${order.shipping_info?.district}</span>
                            <span>Sub District: ${order.shipping_info?.sub_district}</span>
                            <span>Address: ${order.shipping_info?.address}</span>
                            <span>Email: ${order.shipping_info?.email}</span>
                        </div>
    
                    </div>
    
                    <div style="position: relative; overflow-x: auto; width: 100%; margin-top: 56px;">
                        <table style="width: 100%; font-size: 16px; text-align: left;border-collapse: collapse;">
                            <thead
                                style="font-size: 12px; text-transform: uppercase;background: rgb(59 130 246 /1);color: white;border: none;"
                                class="text-xs  uppercase bg-blue-500 text-white">
                                <tr>
                                    <th style="padding: 12px 24px;">
                                        No
                                    </th>
                                    <th style="padding: 12px 24px;">
                                        Item name
                                    </th>
                                    <th style="padding: 12px 24px;">
                                        quantity
                                    </th>
                                    <th style="padding: 12px 24px; text-align: end;">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.order_items?.map((item, i) => `<tr  style="${i % 2 === 0 ? 'background-color:white' : 'background-color:rgb(241 245 249 /1)'}">
                                    <th style="padding: 12px 24px;font-weight: 500; color: rgb(17 24 39 /1);">
                                        1
                                    </th>
                                    <th style="padding: 12px 24px;font-weight: 500; color: rgb(17 24 39 /1);">
                                    ${item.name}
                                    </th>
                                    <th style="padding: 12px 24px;font-weight: 500; color: rgb(17 24 39 /1);">
                                    ${item.quantity}
                                    </th>
                                    <th
                                        style="padding: 12px 24px;font-weight: 500; color: rgb(17 24 39 /1);text-align: end;">
                                        $${item.price}
                                    </th>
                                </tr>`)}
                            </tbody>
                        </table>
                    </div>
                    <div style="display: flex;justify-content: flex-end;margin-top: 32px;">
                        <div style="padding:12px 24px;column-gap: 16px; display: flex; border-top: 1px solid #d0cdcd;">
                            <h2 style="font-size: 18px; font-weight: 600;">Total amount: </h2>
                            <h2 style="font-size: 18px; font-weight: 600;">$${order.total_price}</h2>
                        </div>
                    </div>
    
                </div>
                <div
                    style="display: flex;justify-content: flex-end;flex-direction: column; padding-left: 24px; padding-right: 24px; margin-top: 20px; row-gap: 4px;  color: rgb(59 130 246 /1);font-size: 16px;">
                    <span>Huawei Authorized Experience Shop-Top Enterprise</span>
                    <span>Hospital Road, Pabna 6600</span>
                    <span>01944-888674 , sheikhfarid@gmail.com</span>
                </div>
            </div>
    </body>
    
    </html>`

    return html
}