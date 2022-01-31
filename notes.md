
# Mongo COntainer 

Select db

```
use admin
```

```
db.createUser(
  {
    user: "app-user",
    pwd:  "app-user",   // or cleartext password
    roles: [ { role: "readWrite", db: "movie-app" }]
  }
)
```

Delete user

```
db.dropUser("app-user")
```