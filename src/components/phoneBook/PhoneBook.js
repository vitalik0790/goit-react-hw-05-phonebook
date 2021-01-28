import React, { Component } from 'react'
import ContactForm from './contactForm/ContactForm'
import { v4 as uuidv4 } from 'uuid';
import ContactList from './contactList/ContactList';
import ContactFilter from './contactFilter/ContactFilter';
import { CSSTransition } from "react-transition-group";
import s from './PhoneBook.module.css';
import Notification from './notification/Notification';



class PhoneBook extends Component {
    state = {
        contacts: [],
        filter: "",
        newContact: null,
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

    addContact = (newContact) => {
        const contact = {
            id: uuidv4(),
            name: newContact.name,
            number: newContact.number,
        };


        this.setState((prevState) => {
            return prevState.contacts.find(
                (contact) =>
                    contact.name.toLowerCase() === newContact.name.toLowerCase()
            )
                ? this.setState({ doubleName: contact.name })
                : {
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
                <CSSTransition in={this.state.newContact} timeout={250} classNames={s} unmountOnExit>
                    <Notification name={this.state.newContact} />
                </CSSTransition>
            </div >
        );
    }
}

export default PhoneBook;
