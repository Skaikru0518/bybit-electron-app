# Backend

- Electron JS
- API Using Electron IPC
- Electron Store

### Routes

- eStore (api/store/eStore.js)

```javascript
setStorage(key, value) # sets a (value) assigned to (key) to electron-store
getStorage(key) # gets a (value) from a (key) from electron-store
```

- getAccountInfo

```javascript
get account info
```

- getAllOrders

```javascript
//get all order info
settleCoin is required
category is required
getAllOrdesr(linear, USTD)
```

- getAllPositions

```javascript
get all position info
getAllPositions(linear, USTD)
```
