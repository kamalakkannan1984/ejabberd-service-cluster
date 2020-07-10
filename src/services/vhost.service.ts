/**
 * @createdBy Kamal
 * @createdOn 5th May 2020
 */

import axios from 'axios';
import { config } from '../config/app';
const Client = require('@appunto/ejabberd-api-client');

class Vhost {
  public host: string;
  public port: string;
  public prefix: string;
  public client: any;
  constructor() {
    this.host = config.ejabberdHost;
    this.port = config.ejabberdPort;
    this.prefix = config.ejabberdApiPrefix;
    this.client = new Client(this.host, this.port);
  }

  /**
   * add vhost Node 1
   */
  public async addVhostNode1(data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        return await axios
          .post(`http://82.113.66.120:5001/api/vhost`, data)
          .then((response) => {
            // console.log(response);
            resolve(response.data);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  /**
   * add vhost Node 2
   */
  public async addVhostNode2(data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        return await axios
          .post(`http://82.113.74.69:5001/api/vhost`, data)
          .then((response) => {
            // console.log(response);
            resolve(response.data);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }
}

export default Vhost;
