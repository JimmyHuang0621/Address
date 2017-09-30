const request = require('request')
const cheerio = require('cheerio')
const Browser = require('zombie')

function Aspx(url) {
    return new Promise((resolve, reject) => {
        let Web = new Browser()
        Web.visit(url, () => {
            const $ = cheerio.load(Web.html())
            let Address = $("td:contains('地址')").next().text().replace(/[ \n\t]/g, "")
            if (Address.length)
                resolve(Address)
            else
                reject("Can't Get Element")
            Web.tabs.closeAll()
        })
    })
}

function Address(url) {
    if (typeof url === 'string')
        url = encodeURI(url)
    else
        return Promise.reject('Error type')
    if (url.includes('taiwanjobs.gov'))
        return Aspx(url)
    return new Promise((resolve, reject) => {
        if (!url.includes('yes123.com') && !url.includes('518.com') && !url.includes('job178.com') && !url.includes('taiwanjobs.gov'))
            reject('Only:yes123,518,job178,taiwanjobs')
        else if (!url.includes('taiwanjobs.gov'))
            request(url, (err, res, body) => {
                if (!err) {
                    const $ = cheerio.load(body)
                    if (url.includes('yes123.com'))
                        resolve($("span:contains('地址')").next().clone().children().remove().end().text().replace(/[ \n\t]/g, ""))
                    else if (url.includes('518.com'))
                        resolve($("b:contains('地址')").next().clone().children().remove().end().text().replace(/[ \n\t]/g, ""))
                    else if (url.includes('job178.com'))
                        resolve($("h2:contains('基本資料')").parent().next().children().children().eq(2).text())
                } else
                    reject(err)
            })
    })
}

//input url(String) return Address(String)
Address('https://www.taiwanjobs.gov.tw/Internet/jobwanted/company_desc.aspx?EMPLOYER_ID=66467&BRANCH_ID=7772629').then(x => console.log(x)).catch(x => console.log(x))