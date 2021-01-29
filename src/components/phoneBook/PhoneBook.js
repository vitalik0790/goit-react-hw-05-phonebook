import React, { Component } from 'react'
import ContactForm from './contactForm/ContactForm'
import { v4 as uuidv4 } from 'uuid';
import ContactList from './contactList/ContactList';
import ContactFilter from './contactFilter/ContactFilter';
import { CSSTransition } from "react-transition-group";
import s from './PhoneBook.module.css';
import Notification from './notification/Notification';
import Empty from './empty/Empty';


class PhoneBook extends Component {
    state = {
        contacts: [],
        filter: "",
        newContact: null,
        showAlert: false,
        showEmpty: false,
    }

    componentDidMount() {
        const persistedContacts = localStorage.getItem("contacts")
        if (persistedContacts) {
            this.setState({
                contacts: JSON.parse(persistedContacts)
            })
        }
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevState.contacts !== this.state.contacts) {
            localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
        }
    }

    addContact = ({ name, number }) => {
        const { contacts } = this.state;
        const contact = {
            id: uuidv4(),
            name,
            number,
        };

        if (contacts.find(
            el => el.name.toLowerCase() === name.toLowerCase(),
        )) {
            this.setState({ newContact: contact.name, showAlert: true })
            setTimeout(() => this.setState({ newContact: null, showAlert: false }), 2500);
            return;
        }
        if (!name.length || !number.length) {
            this.setState({ showEmpty: true });
            setTimeout(() => this.setState({ showEmpty: false }), 2500);
            return;
        }
        this.setState(prevState => {
            return {
                contacts: [...prevState.contacts, contact],
            };
        });

    };

    deleteContact = (e) => {
        const id = e.target.dataset.id
        this.setState({ contacts: [...this.state.contacts.filter(contact => contact.id !== id)] })
    }

    onHandleFilter = (e) => {
        this.setState({ filter: e.target.value })
    }

    getFiltredContacts = () => {
        const { contacts, filter } = this.state;
        return contacts.filter(contact => contact.name.toLowerCase().includes(filter.toLowerCase()))
    }


    render() {
        const { newContact, showAlert, showEmpty } = this.state;

        return (
            <div>
                <CSSTransition
                    in={true}
                    appear={true}
                    timeout={500}
                    classNames={s}
                >
                    <h1 className={s.title}>Phonebook</h1>
                </CSSTransition>

                <ContactForm addContact={this.addContact} />

                {this.state.contacts.length > 0 && <ContactFilter filter={this.state.filter} onHandleFilter={this.onHandleFilter} />}
                <ContactList contacts={this.getFiltredContacts()} deleteContact={this.deleteContact} />

                <CSSTransition in={showEmpty} appear={true} timeout={250} classNames={s} unmountOnExit>
                    <Empty />
                </CSSTransition>

                <CSSTransition in={showAlert} appear={true} timeout={250} classNames={s} unmountOnExit>
                    <Notification name={newContact} />
                </CSSTransition>
            </div >
        );
    }
}

export default PhoneBook;
