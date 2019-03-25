import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import { Signup } from './Signup';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('Signup', function () {
        it('should show error message', function () {
            const wrapper = mount(<Signup handleCreateUser={() => { }} />);
            const nbp = wrapper.find('p').length;
            const error = 'An error message';
            wrapper.setState({ error });
            expect(wrapper.find('p').length).toEqual(nbp + 1);
            expect(wrapper.find('p').text()).toEqual(error);
            wrapper.setState({ error: '' });
            expect(wrapper.find('p').length).toEqual(nbp);
        });

        it('should call handleCreateUser with the form data', function () {
            const email = 'roro@pepe.bob';
            const password = 'pouetpouet';
            const spy = expect.createSpy();
            const wrapper = mount(<Signup handleCreateUser={spy} />);
            wrapper.find({ name: 'email' }).instance().value = email;
            wrapper.find({ name: 'password' }).instance().value = password;
            wrapper.find('form').simulate('submit');
            expect(spy.calls[0].arguments[0]).toEqual({ email, password });
        });

        it('should set error if password is too short', function () {
            const email = 'roro@pepe.bob';
            const password = '      pouet         ';
            const spy = expect.createSpy();
            const wrapper = mount(<Signup handleCreateUser={spy} />);
            wrapper.find({ name: 'email' }).instance().value = email;
            wrapper.find({ name: 'password' }).instance().value = password;
            wrapper.find('form').simulate('submit');
            expect(spy).toNotHaveBeenCalled();
            expect(wrapper.state('error')).toNotEqual('');
        });

        it('should set handleCrateUser callback error', function () {
            const reason = 'Les carottes sont cuites';
            const spy = expect.createSpy();
            const wrapper = mount(<Signup handleCreateUser={spy} />);
            wrapper.find({ name: 'password' }).instance().value = 'password';
            wrapper.find('form').simulate('submit');
            spy.calls[0].arguments[1]({ reason });
            expect(wrapper.state('error')).toEqual(reason);
            spy.calls[0].arguments[1]();
            expect(wrapper.state('error')).toEqual('');
        });

    });
}