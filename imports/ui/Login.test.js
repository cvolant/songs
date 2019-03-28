import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Login } from './Login';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('Login', function () {/* 
        it('should show error message', function () {
            const error = 'This is not working';
            const wrapper = mount(<Login handleLogin={() => { }} />);
            const nbp = wrapper.find('p').length;
            wrapper.setState({ error });
            expect(wrapper.find('p').text()).toEqual(error);
            wrapper.setState({ error: '' });
            expect(wrapper.find('p').length).toEqual(nbp);
        });

        it('should call handleLogin with the form data', function () {
            const email = 'coucou@pouet.fr';
            const password = 'qwertqwert';
            const spy = expect.createSpy();
            const wrapper = mount(<Login handleLogin={spy} />);
            wrapper.find({ name: 'email'}).instance().value = email;
            wrapper.find({ name: 'password'}).instance().value = password;
            wrapper.find('form').simulate('submit');
            expect(spy.calls[0].arguments[0]).toEqual({ email });
            expect(spy.calls[0].arguments[1]).toEqual(password);
        });

        it('should set handleLogin callback error', function () {
            const spy = expect.createSpy();
            const wrapper = mount(<Login handleLogin={spy} />);
            wrapper.find('form').simulate('submit');
            spy.calls[0].arguments[2]({});
            expect(wrapper.state('error')).toNotEqual('');
            spy.calls[0].arguments[2]();
            expect(wrapper.state('error')).toEqual('');
        }); */
    });
}