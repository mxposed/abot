import config from '@abot/config';
import ApiClient from '@abot/api-client';
import { SessionDao } from "../../../src/sessions/client";
import Application from '../../../src/app';
import DemandModel from "../../../src/models/demand-model";
import DAO from "@abot/dao/target/tests";
import {v4} from 'uuid';

let application = new Application(config);
let dao = new DAO(config);
let client = new ApiClient(config);
let sessions = new SessionDao(config);
let demandModel = new DemandModel(dao);

beforeAll(async () => {
    await application.start();
    await client.start();
    await sessions.start();
    await dao.clear();
});

afterAll(async () => {
    await application.end();
    await client.end();
    await sessions.end();
    await dao.end();
});

describe("Next demand main scenario", () => {
    let session_key;
    let response;

    const senderSession = {
        id: v4(),
        login: "admin_user_login",
        type: "user_type",
        isAdmin: false,
        isBanned: false,
        payload: {}
    };

    const sender2Session = {
        id: v4(),
        login: "admin_user_login_2",
        type: "user_type",
        isAdmin: false,
        isBanned: false,
        payload: {}
    };

    const recipientSession = {
        id: v4(),
        login: "user_login",
        type: "user_type",
        isAdmin: false,
        isBanned: false,
        payload: {}
    };

    const senderUser = {
        passwordHash: "user_pass_hash",
        ...senderSession,
    }

    const sender2User = {
        passwordHash: "user_pass_hash",
        ...sender2Session,
    }

    const recipientUser = {
        passwordHash: "user_pass_hash",
        ...recipientSession,
    }

    const scenario = {
        "id": "blah",
        "description": "Some scenario",
        "isDeleted": false,
        "payload": {},
    }

    const scenario2 = {
        "id": "blahblah",
        "description": "Some other scenario",
        "isDeleted": false,
        "payload": {},
    }

    const demandNoise = {
        id: v4(),
        date: new Date(Date.now()).toISOString(),
        scenario: scenario2.id,
        recipient: recipientUser.id,
        sender: null,
        isActive: true,
        payload: {}
    }

    const demandNoise2 = {
        id: v4(),
        date: new Date(Date.now()).toISOString(),
        scenario: scenario.id,
        recipient: recipientUser.id,
        sender: null,
        isActive: false,
        payload: {}
    }

    const demandNoise3 = {
        id: v4(),
        date: new Date(Date.now()).toISOString(),
        scenario: scenario.id,
        recipient: recipientUser.id,
        sender: sender2User.id,
        isActive: true,
        payload: {}
    }

    // The oldest demand which is active, has no sender and correct scenario.
    const demand = {
        id: v4(),
        date: new Date(Date.now()).toISOString(),
        scenario: scenario.id,
        recipient: recipientUser.id,
        sender: null,
        isActive: true,
        payload: {}
    }

    const demand2 = {
        id: v4(),
        date: new Date(Date.now()).toISOString(),
        scenario: scenario.id,
        recipient: recipientUser.id,
        sender: null,
        isActive: true,
        payload: {}
    }

    beforeAll(async () => {

        await dao.prepareDB(
          {
              "Users": [
                  senderUser,
                  sender2User,
                  recipientUser,
              ],
              "Scenarios": [
                  scenario,
                  scenario2,
              ],
              "Demands": [
                  demandNoise,
                  demandNoise2,
                  demandNoise3,
                  demand,
                  demand2,
              ],
              "UsersScenarios": [
                  {
                      "user": senderUser.id,
                      "scenario": scenario.id,
                  }
              ],
          }
        )
        session_key = await sessions.create_session(senderSession);
        response = await client.demands.next({ session: session_key });
    });

    test("response code correct", () => expect(response.code).toBe(200));
    test("response status correct", () => expect(response.status).toBe("ok"));
    test("response demand id in answer", () => expect(response.response.id).toBe(demand.id));
    test("response demand sender in answer", () => expect(response.response.sender).toBe(senderUser.id));

    describe("Demand should be updated", () => {
        let result;

        beforeAll(async () => {
            result = await demandModel.get(demand.id);
        });

        test("should set sender", () => expect(result.sender).toBe(senderUser.id));
    });
});
