const { _get, timestamp } = require('../helpers/utilities');
const errors = require('../data/errors');

module.exports = {
  /**
   * Get all devices information
   *
   * @returns {Promise<{msg: string, error: number}|*>}
   */
  async getDevices() {
    const { APP_ID } = this;

    try {
      let isContinue = true;
      let beginIndex = -99999;
      let devicelist = [];

      while (isContinue) {
        const response = await this.makeRequest({
          uri: '/device/thing',
          qs: {
            num: 100,
            beginIndex: beginIndex
          }
        });
    
        const error = _get(response, 'error', false);
        const thingList = _get(response, 'data.thingList', false);
    
        if (error) {
          isContinue = false;
        } else {
          devicelist = devicelist.concat(thingList);
          if (thingList.length === 0 || devicelist.length >= response.data?.total) {
            isContinue = false;
          } else {
            beginIndex = thingList[thingList.length - 1].index;
          }
        }
      }

      if (!devicelist) {
        return { error: 404, msg: errors.noDevices };
      }

      return devicelist;
    } catch (err) {
      return { error: 500, msg: err };
    }
  },
};