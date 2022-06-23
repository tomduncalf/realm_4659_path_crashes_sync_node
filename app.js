const Realm = require("realm");

const MONGO_ATLAS_APP_ID = process.env.MONGO_ATLAS_APP_ID;

const TaskSchema = {
  name: "Task",
  properties: {
    _id: "int",
    name: "string",
    status: "string?",
  },
  primaryKey: "_id",
};

const config = {
  schema: [TaskSchema],
};

console.log("Opening local Realm");
const localConfig = {
  ...config,
  path: "local.realm",
};
let realm = new Realm(localConfig);

setTimeout(async () => {
  const app = new Realm.App(MONGO_ATLAS_APP_ID);
  const user = await app.logIn(Realm.Credentials.anonymous());

  const syncConfig = {
    ...config,
    path: "sync.realm",
    sync: { flexible: true, user },
  };

  console.log("Copying local Realm to sync Realm");
  realm.writeCopyTo(syncConfig);
  realm.close();

  console.log("Opening sync Realm");
  realm = await Realm.open(syncConfig);
}, 2000);
