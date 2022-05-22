
# Mongo COntainer 

## Connect to local Mongo

```
 mongo -u root -p 4GUeVu1X1CtfMYTX
```

Select db

```
use admin
```

List users

```
db.getUsers();
```

```
db.createUser(
  {
    user: "app-user",
    pwd:  "app-user",
    roles: [ { role: "readWrite", db: "movie-app" }]
  }
)
```

Delete user

```
db.dropUser("app-user")
```


# Mongo Realm

realm-cli login --api-key <my-api-key> --private-api-key <my-private-api-key>


realm-cli pull --remote movieshare-pdlob --template web.mql.todo