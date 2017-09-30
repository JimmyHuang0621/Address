const request = require('request')
const cheerio = require('cheerio')

function Address(url) {
    url = typeof url === 'string' ? encodeURI(url) : url
    return new Promise((resolve, reject) => {
        if (!url.includes('yes123.com') && !url.includes('518.com') && !url.includes('job178.com'))
            reject('Only:yes123,518,job178')
        else
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

// Address('https://www.yes123.com.tw/admin/job_refer_comp_info.asp?p_id=20140206142429_12204275').then(x => console.log(x)).catch(err => console.log(err))
// Address('https://www.yes123.com.tw/admin/job_refer_comp_info.asp?p_id=92905_43816068').then(x => console.log(x)).catch(err => console.log(err))
// Address('https://www.518.com.tw/單人房住宿空間_統領健身企業股份有限公司-company-1446114.html').then(x => console.log(x)).catch(err => console.log(err))
// Address('http://www.job178.com.tw/company_4681').then(x => console.log(x)).catch(err => console.log(err))
// Address('https://www.taiwanjobs.gov.tw/Internet/jobwanted/company_desc.aspx?EMPLOYER_ID=397976&BRANCH_ID=7925771').then(x => console.log(x)).catch(err => console.log(err))