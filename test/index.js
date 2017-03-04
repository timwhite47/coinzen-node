import Coinzen from '../src/index';
import fetchMock from 'fetch-mock';
import { expect } from 'chai';
import casual from 'casual';
import sinon from 'sinon';

describe('Coinzen', () => {
  afterEach(() => {
    fetchMock.restore();
  });
  describe('.initializeDevice()', () => {
    beforeEach(function (done) {
      fetchMock.post('http://localhost:3000/devices', require('./fixtures/initialized_device.json'));
      Coinzen.initializeDevice('some_uid').then((response) => {
        this.subject = response;
        done();
      });
    });

    it('has correct response', function () {
      expect(this.subject).to.deep.equal(require('./fixtures/initialized_device.json'));
    });

    it('has no user associated', function () {
      expect(this.subject.device.user_id).to.not.be;
    });
  });

  describe('.authenticateUser()', () => {
    beforeEach(function (done) {
      fetchMock.post('http://localhost:3000/users/authenticate', { jwt: 'some_for_realz_jwt' });

      this.email = casual.email;
      this.password = casual.password;

      Coinzen.authenticateUser({
        email: this.email,
        password: this.password,
      }).then((jwt) => {
        this.subject = jwt;
        done();
      });
    });

    it('returns correct jwt', function () {
      expect(this.subject).to.equal('some_for_realz_jwt');
    });
  });

  describe('#claimDevice()', () => {
    beforeEach(function (done) {
      fetchMock.post('http://localhost:3000/devices/1/claim', require('./fixtures/claimed-device.json'));
      this.jwt = 'some_for_realz_jwt';
      this.activationCode = 'UXWGPKJMGVPC';
      this.deviceId = 1;

      const cz = new Coinzen(this.jwt, this.activationCode);

      cz
        .claimDevice(this.deviceId, this.activationCode)
        .then((device) => {
          this.subject = device;
          done();
        });
    });

    it('returns a device claimed by user', function () {
      expect(this.subject.user_id).to.be;
    });
  });

  describe('.createUser()', () => {
    beforeEach(function (done) {
      fetchMock.post('http://localhost:3000/users', require('./fixtures/created_user.json'));
      this.name = casual.name;
      this.email = casual.email;
      this.password = casual.password;

      Coinzen.createUser({
        name: this.name,
        email: this.email,
        password_confirmation: this.password,
        password: this.password,
      }).then(({ user, hdPrivKey }) => {
        const [url, params] = fetchMock.lastCall();

        this.subject = user;
        this.hdPrivKey = hdPrivKey;
        this.url = url;
        this.params = params;

        done();
      });
    });

    it('calls with correct params', function () {
      const expectedKey = this.hdPrivKey.derive('m/45\'').hdPublicKey.toString();
      const { user: { bip45, password, password_confirmation, email } } = JSON.parse(this.params.body);

      expect(password).to.equal(this.password);
      expect(password_confirmation).to.equal(this.password);
      expect(email).to.equal(this.email);
      expect(bip45).to.equal(expectedKey);
    });

    it('stores bip45', function () {
      expect(this.subject.bip45).to.match(/tpub/);
    });
  });
});
