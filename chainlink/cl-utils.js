const http = require('http');

module.exports = {
  getAcctAddr: getAcctAddr,
  getRunLogJobForOracle: getRunLogJobForOracle,
  getTaskForType: getTaskForType,
  postJob: postJob,
};

async function getAcctAddr() {
  const sessionCookie = await getSessionCookie();
  const opts = {
    host: 'localhost',
    port: '6688',
    path: '/v2/user/balances',
    method: 'GET',
    headers: {
      'Cookie': sessionCookie
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      res.setEncoding('utf-8')
      
      let resBody = '';
      res.on('data', (chunk) => {
        resBody += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(resBody).data[0].id);
      });

      res.on('error', (err) => {
        reject(err);
      });
    });

    req.end();
  });
}

function getRunLogJobForOracle(oracleContractAddress) {
  const job = JSON.parse(JSON.stringify(jobs.runLogJob));
  job.initiators[0].params.address = oracleContractAddress;
  return job;
}

function getTaskForType(type) {
  return JSON.parse(JSON.stringify(tasks[type]));
}

async function postJob(job) {
  const sessionCookie = await getSessionCookie();
  const opts = {
    host: 'localhost',
    port: '6688',
    path: '/v2/specs',
    method: 'POST',
    headers: {
      'Cookie': sessionCookie
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      res.setEncoding('utf-8')
      
      let resBody = '';
      res.on('data', (chunk) => {
        resBody += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(resBody));
      });

      res.on('error', (err) => {
        reject(err);
      });
    });

    req.write(JSON.stringify(job));
    req.end();
  });
}

function getSessionCookie() {
  const opts = {
    host: 'localhost',
    port: '6688',
    path: '/sessions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      res.setEncoding('utf-8');
      
      res.on('data', () => { /* DO NOTHING */ });
      res.on('end', () => {
        resolve(res.headers["set-cookie"][0]);
      });

      res.on('error', (err) => {
        reject(err);
      });
    });

    const reqBody = JSON.stringify({
      email: 'user@example.com',
      password: 'password'
    });

    req.write(reqBody);
    req.end();
  });
}

const jobs = {
  runLogJob: {
    initiators: [
      {
        type: "runlog",
        params: {}
      }
    ],
    tasks: []
  }
};

const tasks = {
  ethTx: { type: "ethtx" },
  ethUint256: { type: "ethuint256" },
  httpGet: { type: "httpget" },
  jsonParse: { type: "jsonparse" },
}
