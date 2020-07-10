/**
 * @createdBy Kamal
 * @createdOn 10th June 2020
 */

import { callHistoryModel } from '../models/callHistory.model';
import { uuid } from 'uuidv4';

const callHistoryHandler: any = {};

/**
 *
 * @param {Object} req - request object
 * @param {Object} reply - response object
 * @description - save  call history function
 */
callHistoryHandler.saveCallHistory = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    const auth = req.authorization;
    data.uuid = uuid();
    data.bound = req.body.bound;
    data.medium = req.body.medium;
    data.call_duration = req.body.call_duration;
    data.from_caller = req.body.from_caller;
    data.to_caller = req.body.to_caller;
    data.inserted_at = new Date();
    data.updated_at = new Date();
    data.inserted_by = auth.sipLoginId;
    data.updated_by = auth.sipLoginId;
    const callsCollection = await this.mongo.MONGO1.db.collection('calls');
    const result = await callHistoryModel.saveCallHistory(data, callsCollection);
    if (result.insertedCount === 1) {
      res.send({ status_code: 200, uuid: data.uuid, message: 'saved successfully' });
    } else {
      res.send({ status_code: 200, message: 'failed' });
    }
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

/**
 *
 * @param {Object} req - request object
 * @param {Object} reply - response object
 * @description - update call history function
 */
callHistoryHandler.updateCallHistory = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    const auth = req.authorization;
    const uuid = req.params.uuid;
    data.bound = req.body.bound;
    data.medium = req.body.medium;
    data.call_duration = req.body.call_duration;
    data.from_caller = req.body.from_caller;
    data.to_caller = req.body.to_caller;
    data.updated_at = new Date();
    data.updated_by = auth.sipLoginId;
    const callsCollection = await this.mongo.MONGO1.db.collection('calls');
    const result = await callHistoryModel.updateCallHistory(uuid, data, callsCollection);
    if (result.modifiedCount === 1) {
      res.send({ status_code: 200, message: 'update successfully' });
    } else {
      res.send({ status_code: 200, message: 'failed' });
    }
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

/**
 *
 * @param {Object} req - request object
 * @param {Object} reply - response object
 * @description - get call history function
 */
callHistoryHandler.getCallHistory = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    const ext = req.params.ext;
    const callsCollection = await this.mongo.MONGO1.db.collection('calls');
    const result = await callHistoryModel.getCallHistory(ext, callsCollection);
    if (result) {
      res.send({ status_code: 200, result: result });
    } else {
      res.send({ status_code: 200, message: 'failed' });
    }
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

callHistoryHandler.deleteCallHistory = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    // tslint:disable-next-line: no-shadowed-variable
    const uuid = req.body.uuid;
    const callsCollection = await this.mongo.MONGO1.db.collection('calls');
    const result = await callHistoryModel.deleteCallHistory(uuid, callsCollection);
    if (result.deletedCount > 0) {
      res.send({ status_code: 200, message: 'Successfully deleted' });
    } else {
      res.send({ status_code: 200, message: 'failed' });
    }
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

export const callHistoryHandlers: any = callHistoryHandler;
