/**
 * @createdBy Kamal
 * @createdOn 15th June 2020
 */

import * as shell from 'shelljs';
import VhostService from '../services/vhost.service';

const ejabberdConfigHandler: any = {};

/**
 *
 * @param {Object} req - request object
 * @param {Object} reply - response object
 * @description - add vhost function
 */
ejabberdConfigHandler.addVhost = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    data.vhost = req.body.vhost;
    console.log(data);
    const vhost = new VhostService();
    const nodeOneData = await vhost.addVhostNode1(data);
    const node2Vhost = await vhost.addVhostNode2(data);
    console.log(nodeOneData);
    console.log(node2Vhost);
    // const status_code = nodeOneData.status_code;

    res.send(nodeOneData);

    /*shell.cd('/');
    shell.cd('opt/ejabberd/conf');
    const src = shell.cat('hosts.yml');
    const str = src.stdout.replace(/^\n+/i, '');
    const strArr = str.split('-');
    const isStr = strContains(strArr, `"${vhost}"`);
    if (isStr === false) {
      shell.ShellString(`\n  - "${vhost}"`).toEnd('hosts.yml');
      shell.cd('/');
      shell.cd('opt/ejabberd-19.02/bin');
      shell.exec('./ejabberdctl reload_config');
      res.send({ status_code: 200, message: `Virtual host {${vhost}}  Added successfully` });
    } else {
      res.send({ status_code: 200, message: `Virtual host {${vhost}}  Already exists` });
    } */
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

ejabberdConfigHandler.updateVhost = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    const vhost = req.body.vhost;
    const old_vhost = req.params.vhost;
    console.log(vhost);
    shell.cd('/');
    shell.cd('opt/ejabberd/conf');
    let src = shell.cat('hosts.yml');
    let str = src.stdout.replace(/^\n+/i, '');
    let strArr = str.split('-');
    let isStr = strContains(strArr, `"${old_vhost}"`);
    if (isStr === true) {
      shell.sed('-i', `- "${old_vhost}"`, `- "${vhost}"`, 'hosts.yml');
      shell.cd('/');
      shell.cd('opt/ejabberd-19.02/bin');
      shell.exec('./ejabberdctl reload_config');
      res.send({ status_code: 200, message: `Virtual host {${vhost}}  Updated successfully` });
    } else {
      res.send({ status_code: 200, message: `Virtual host {${old_vhost}}  Not found` });
    }
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

ejabberdConfigHandler.deleteVhost = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    const vhost = req.params.vhost;
    console.log(vhost);
    shell.cd('/');
    shell.cd('opt/ejabberd/conf');
    let src = shell.cat('hosts.yml');
    let str = src.stdout.replace(/^\n+/i, '');
    let strArr = str.split('-');
    let isStr = strContains(strArr, `"${vhost}"`);
    if (isStr === true) {
      //shell.ShellString(`\n  - "${vhost}"`).toEnd('hosts.yml');
      shell.sed('-i', `- "${vhost}"`, '', 'hosts.yml');
      shell.cd('/');
      shell.cd('opt/ejabberd-19.02/bin');
      shell.exec('./ejabberdctl reload_config');
      res.send({ status_code: 200, message: `Virtual host {${vhost}}  Deleted successfully` });
    } else {
      res.send({ status_code: 200, message: `Virtual host {${vhost}}  Not found` });
    }
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

ejabberdConfigHandler.getVhost = async function (req: any, res: any, done: any) {
  try {
    shell.cd('/');
    shell.cd('opt/ejabberd/conf');
    const src = shell.cat('hosts.yml');
    const str = src.stdout.replace(/^\n+/i, '');
    const strArr = str.split('-');
    const result = createArr(strArr);
    res.send({ status_code: 200, result: result });
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

function createArr(arr: any) {
  let arrList: any = [];
  let obj: any = {};
  let a = '';
  let b = '';
  let c = '';
  for (let i = 0; i < arr.length; i++) {
    a = arr[i].replace('" \n', '');
    b = a.trim();
    c = b.replace('"', '');
    if (i === 0) {
      arrList[i] = c;
    } else {
      obj[i] = c;
    }
  }
  return obj;
}

function strContains(arr: any, val: string) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].trim() === val) {
      return true;
    }
  }
  return false;
}

export const ejabberdConfigHandlers: any = ejabberdConfigHandler;
