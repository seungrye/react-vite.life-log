import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { migrate_post_to_post_v2 } from "./no0001_migrate_post_to_post_v2";
import { migrate_post_v2_to_post_v3 } from "./no0002_migrate_post_v2_to_post_v3";
import { migrate_post_v3_to_post_v4 } from "./no0003_migrate_post_v3_to_post_v4";

let migrated = false;

export function migrateFirestore() {
  if (migrated) return console.log("migrated")

  const migrateFnList = [
    migrate_post_to_post_v2, 
    migrate_post_v2_to_post_v3,
    migrate_post_v3_to_post_v4
  ];

  const fetchMigratedList = async (fnList: (() => void)[]) => {
    try {
      const migrateQuery = query(collection(db, "migrated"));
      const querySnapshot = await getDocs(migrateQuery);
      const migrated: string[] = [];
      querySnapshot.forEach((doc) => {
        const { name } = doc.data();
        migrated.push(name)
      });
      return fnList.filter(v => !migrated.includes(v.name));
    } catch (e: unknown) {
      console.error(e)
      return []
    }
  }

  const applyMigrate = async (fn: () => void): Promise<() => void> => {
    try {
      fn();
    } catch (e: unknown) {
      console.error(e)
    }

    return fn;
  }

  const updateMigratedList = async (name: string) => {
    try {
      await addDoc(
        collection(db, "migrated"), {
        name: name,
        applied: new Date()
      });
    } catch (e: unknown) {
      console.error(e)
    }
  }

  fetchMigratedList(migrateFnList)
    .then(fnList => Promise.all(fnList.map(async v => await applyMigrate(v))))
    .then(fnList => Promise.all(fnList.map(async v => await updateMigratedList(v.name))))
    .finally(() => { migrated = true; })
}
