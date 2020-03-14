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

const createDesignDoc = (name, mapFn) => {
    const ddoc = {
        _id: '_design/' + name,
        views: {}
    }
    ddoc.views[name] = {
        map: mapFn.toString()
    }
    return ddoc
}

const addDesignDoc = (database, name, designDoc) => {
    return new Promise(((resolve, reject) => {
        const auth = btoa(`${API_KEY}:${API_KEY_PASSWORD}`)
        var options = {
            url:  `${COUCHDB_URL}${database}/_design/${name}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: designDoc,
            json: true
        }

        request.put(options, (err, resp, doc) => {
            if (err) {
                reject(err)
            } else {
                // todo: query doc to init
                resolve(doc)
            }
        })
    }))
}

const queryDesignDoc = (database, doc, key) => {
    return new Promise(((resolve, reject) => {
        const auth = btoa(`${API_KEY}:${API_KEY_PASSWORD}`)
        var options = {
            url:  `${COUCHDB_URL}${database}/_design/${doc}/_view/${doc}?start_key=${key}&end_key=${key}&include_docs=true`,
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

const getDocument = (database, doc) => {
    return new Promise(((resolve, reject) => {
        const auth = btoa(`${API_KEY}:${API_KEY_PASSWORD}`)
        var options = {
            url:  `${COUCHDB_URL}${database}/${doc}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            json: true
        }

        request.get(options, (err, resp, doc) => {
            if (err) {
                reject(err)
            } else {
                resolve(doc)
            }
        })
    }))
}

const updateDocument = (database, doc) => {
    return new Promise(((resolve, reject) => {
        const auth = btoa(`${API_KEY}:${API_KEY_PASSWORD}`)
        var options = {
            url:  `${COUCHDB_URL}${database}/${doc._id}?rev=${doc._rev}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: doc,
            json: true
        }

        request.put(options, (err, resp, doc) => {
            if (err) {
                reject(err)
            } else {
                resolve(doc)
            }
        })
    }))
}

const bulkDocs = (database, docs) => {
    return new Promise(((resolve, reject) => {
        const auth = btoa(`${API_KEY}:${API_KEY_PASSWORD}`)
        var options = {
            url:  `${COUCHDB_URL}${database}/_bulk_docs`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: docs,
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

module.exports = {
    getAllDatabases,
    getDocumentsByType,
    getAllDocuments,
    addDocument,
    deleteDocument,
    getChangeFeed,
    createDesignDoc,
    addDesignDoc,
    queryDesignDoc,
    getDocument,
    updateDocument,
    bulkDocs
}
