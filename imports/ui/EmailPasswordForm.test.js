import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { EmailPasswordForm } from './EmailPasswordForm';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('EmailPasswordForm', () => {
        let wrapper;
        let handleCreateUser;
        let handleLogin;
        const email = 'some@email.address';
        const password = 'password';
        
        beforeEach(() => {
            handleCreateUser = expect.createSpy();
            handleLogin = expect.createSpy();
        });

        const mountAndFill = (email, password, alreadySignedUp) => {
            const wrapper = mount(<EmailPasswordForm handleCreateUser={handleCreateUser} handleLogin={handleLogin} classes={{}} alreadySignedUp={alreadySignedUp} />);
            wrapper.find('input[type="text"]').instance().value = email;
            wrapper.find('input[type="password"]').instance().value = password;
            return wrapper;
        };

        it('should show error message', function () {
            const wrapper = mount(<EmailPasswordForm handleCreateUser={handleCreateUser} handleLogin={handleLogin} classes={{}} alreadySignedUp={false} />);
            const nbp = wrapper.find('p').length;
            const error = 'An error message';
            wrapper.setState({ error });
            expect(wrapper.find('p').length).toEqual(nbp + 1);
            expect(wrapper.find('p').text()).toEqual(error);
            wrapper.setState({ error: '' });
            expect(wrapper.find('p').length).toEqual(nbp);
        });

        describe('Sign up', () => {

            it('should call handleCreateUser with the form data', function () {
                const filledWrapper = mountAndFill(email, password, false);
                filledWrapper.find('form').simulate('submit');
                expect(handleCreateUser.calls[0].arguments[0]).toEqual({ email, password });
                expect(handleLogin).toNotHaveBeenCalled();
            });

            it('should set error if password is too short', function () {
                const tooShortPassword = '      short    ';
                const filledWrapper = mountAndFill(email, tooShortPassword, false);
                filledWrapper.find('form').simulate('submit');
                expect(handleCreateUser).toNotHaveBeenCalled();
                expect(filledWrapper.state('error')).toNotEqual('');
            });

            it('should set handleCrateUser callback error', function () {
                const reason = 'Les carottes sont cuites';
                const filledWrapper = mountAndFill(email, password, false);
                filledWrapper.find('form').simulate('submit');
                handleCreateUser.calls[0].arguments[1]({ reason });
                expect(filledWrapper.state('error')).toEqual(reason);
                handleCreateUser.calls[0].arguments[1]();
                expect(filledWrapper.state('error')).toEqual('');
            });
        });

        describe('Sign in', () => {

            it('should call handleLogin with the form data', function () {
                const filledWrapper = mountAndFill(email, password, true);
                filledWrapper.find('form').simulate('submit');
                expect(handleLogin.calls[0].arguments[0]).toEqual({ email });
                expect(handleCreateUser).toNotHaveBeenCalled();
            });

            it('should set handleLogin callback error', function () {
                const reason = 'Les carottes sont cuites';
                const filledWrapper = mountAndFill(email, password, true);
                filledWrapper.find('form').simulate('submit');
                handleLogin.calls[0].arguments[2]({ reason });
                expect(filledWrapper.state('error')).toEqual(reason);
                handleLogin.calls[0].arguments[2]();
                expect(filledWrapper.state('error')).toEqual('');
            });
        });
    });
}