const request = require('request')
const btoa = require('btoa')
const {
    COUCHDB_URL,
    API_KEY,
    API_KEY_PASSWORD
} = require('./config')

const getAllDatabases = () => {
    return new Promise(((resolve, reject) => {
        var options = {
            url: COUCHDB_URL + '_all_dbs',
            headers: { 'Content-Type': 'application/json' }
        }

        request.get(options, (err, resp, databases) => {
            if (err) {
                reject(err)
            } else {
                try {
                    resolve(JSON.parse(databases))
                } catch (e) {
                    reject(e)
                }
            }
        })
    }))
}

const getDocumentsByType = (database, docType) => {
    return new Promise(((resolve, reject) => {
        const auth = btoa(`${API_KEY}:${API_KEY_PASSWORD}`)
        var options = {
            url:  `${COUCHDB_URL}${database}/_find`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: {
                selector: {
                    doc_type: {
                        $eq: `${docType}`
                    }
                },
                limit: 900000
            },
            json: true
        }

        request.post(options, (err, resp, docs) => {
            if (err) {
                reject(err)
            } else {
                resolve(docs)
            }
        })
    }))
}

const getAllDocuments = database => {
    return new Promise(((resolve, reject) => {
        const auth = btoa(`${API_KEY}:${API_KEY_PASSWORD}`)
        var options = {
            url:  `${COUCHDB_URL}${database}/_all_docs`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            json: true
        }

        request.get(options, (err, resp, docs) => {
            if (err) {
                reject(err)
            } else {
                resolve(docs)
            }
        })
    }))
}

const addDocument = (database, document) => {
    return new Promise(((resolve, reject) => {
        const auth = btoa(`${API_KEY}:${API_KEY_PASSWORD}`)
        var options = {
            url:  `${COUCHDB_URL}${database}/${document._id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: document,
            json: true
        }

        request.put(options, (err, resp, docs) => {
            if (err) {
                reject(err)
            } else {
                resolve(docs)
            }
        })
    }))
}

const deleteDocument = (database, id, revision) => {
    return new Promise(((resolve, reject) => {
        const auth = btoa(`${API_KEY}:${API_KEY_PASSWORD}`)
        var options = {
            url:  `${COUCHDB_URL}${database}/${id}?rev=${revision}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            json: true
        }

        request.delete(options, (err, resp, docs) => {
            if (err) {
                reject(err)
            } else {
                resolve(docs)
            }
        })
    }))
}

const getChangeFeed = database => {
    return new Promise(((resolve, reject) => {
        const auth = btoa(`${API_KEY}:${API_KEY_PASSWORD}`)
        var options = {
            url:  `${COUCHDB_URL}${database}/_changes`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            json: true
        }

        request.get(options, (err, resp, docs) => {
            if (err) {
                reject(err)
            } else {
                resolve(docs)
            }
        })
    }))
}

module.exports = {
    getAllDatabases,
    getDocumentsByType,
    getAllDocuments,
    addDocument,
    deleteDocument,
    getChangeFeed
}
