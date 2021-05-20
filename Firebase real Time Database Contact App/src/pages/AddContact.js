// https://firebase.google.com/docs/storage/web/upload-files#full_example
// https://www.npmjs.com/package/browser-image-resizer#asyncawait

import React, { useState, useContext, useEffect } from "react";
import firebase from "firebase/app";

import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Row,
  Col
} from "reactstrap";

// to compress image before uploading to the server
import { readAndCompressImage } from "browser-image-resizer";

// configs for image resizing
//TODO: DONE:  add image configurations
import {imageConfig} from "../utils/config"

import { MdAddCircleOutline } from "react-icons/md";

import { v4 } from "uuid";

// context stuffs
import { ContactContext } from "../context/Context";
import { CONTACT_TO_UPDATE } from "../context/action.types";

import { useHistory } from "react-router-dom";

import { toast } from "react-toastify";

const AddContact = () => {
  // destructuring state and dispatch from context state
  const { state, dispatch } = useContext(ContactContext);

  const { contactToUpdate, contactToUpdateKey } = state;

  // history hooks from react router dom to send to different page
  const history = useHistory();

  // simple state of all component
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null); //exact url of the image that we will grab from the bucket
  const [star, setStar] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  // when their is the contact to update in the Context state
  // then setting state with the value of the contact
  // will changes only when the contact to update changes
  useEffect(() => {
    if (contactToUpdate) {
      setName(contactToUpdate.name);
      setEmail(contactToUpdate.email);
      setPhoneNumber(contactToUpdate.phoneNumber);
      setAddress(contactToUpdate.address);
      setStar(contactToUpdate.star);
      setDownloadUrl(contactToUpdate.picture);

      // also setting is update to true to make the update action instead the addContact action
      setIsUpdate(true);
    }
  }, [contactToUpdate]);

  // To upload image to firebase and then set the the image link in the state of the app
  const imagePicker = async e => {
    // TODO: upload image and set D-URL to state

    try {  
      const file = e.target.files[0]; //choose the file gives entire path u want to upload

      var metadata = {
        contentType : file.type  // will give the extension of image PNG/JPEG etc.
      }

      let resizedImage = await readAndCompressImage(file, imageConfig) //resize the img

      const storageRef = await firebase.storage().ref() //gets reference of firebase databse storage
                                                    //gs://mygitappnew-d2734.appspot.com
      var uploadTask = storageRef
      .child('images/' + file.name) //we click on add button and added different obj in firebase database. child grabs that object if it is not der will create one for u
      .put(resizedImage, metadata); // put takes 2 things what img u want to upload and metadata here we want to upload resizedImage

      uploadTask.on(           
        firebase.storage.TaskEvent.STATE_CHANGED, // STATE_CHANGED means anything that has changed in my database
        snapshot =>{         //if things go successfully it will give us snapshot
          setIsUploading(true)           // a spinner till the time the img is getting Uploaded
          var progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100 

          switch (snapshot.state) {                 //gives the current state of the snapshot
            case firebase.storage.TaskState.PAUSED:
              setIsUploading(false)                 //because it is paused and not uploading
              console.log("Uploading is paused ");
              break;

              case firebase.storage.TaskState.RUNNING:
                console.log("Uploading is in Progress.......");
                break;
          }

          if (progress == 100) {
            setIsUploading(false)                //so that the spinner can stop 
            toast("uploaded", {type: "success"})
          }

        },

        //if things goes wrong it gives us the following error
        error => {
          toast("Something is wrong in state change", {type:"error"})
        },

        //when all the things are done wrong n right. It also gives us the callback whateever u want to do further after that do in this callback
        () => {      //i have uploaded my img, i need downloadurl of that img to store that in my STATE
          uploadTask.snapshot.ref.       //uploadTask which are playing everything once done, i need to access snapshot, and snapshot gives ref
          getDownloadURL()               //to run the method use paranthesis
          .then( downloadURL => { 
            console.log(downloadURL)
            setDownloadUrl(downloadURL)   //put the image in ur state
          })
          .catch(err => console.log(err))
        }
      );
      
    } catch (error) {
      console.error()
      toast("Something went wrong ", {type:"error"})
    }
  };

  // setting contact to firebase DB
  const addContact = async () => {
    //TODO: add contact method

    try {
      firebase.database()
      .ref("contacts/" + v4())    // mygitappnew-d2734-default-rtdb:, create contacts node ""contacts/" and put everything there, give unique key to every contact
      .set({
        name, 
        email, 
        phoneNumber, 
        address, 
        picture: downloadUrl, 
        star
      })
    } catch (error) {
      console.log(error)
    }
  };

  // to handle update the contact when there is contact in state and the user had came from clicking the contact update icon
  const updateContact = async () => {
    //TODO: update contact method
    //when u click on pencil icon to update at that moment we will be carring the CONTACTKEY or the v4 uuid

    try {
      firebase
      .database()
      .ref("contacts/" + contactToUpdateKey)
      .set({
        name,
        email,
        phoneNumber,
        address,
        picture: downloadUrl,
        star
      });
    } catch (error) {
      console.log(error);
      toast("Oppss.....", {type:"error"})
    }
  };

  // firing when the user click on submit button or the form has been submitted
  const handleSubmit = e => {
    e.preventDefault();
    isUpdate ? updateContact() : addContact()

    toast("Success", {type:"success"})

    // isUpdate wll be true when the user came to update the contact
    // when their is contact then updating and when no contact to update then adding contact
    //TODO: set isUpdate value

    // to handle the bug when the user visit again to add contact directly by visiting the link
    dispatch({
      type: CONTACT_TO_UPDATE,
      payload: null,
      key: null
    });

    // after adding/updating contact then sending to the contacts
    // TODO :- also sending when their is any errors
    history.push("/");
  };

  // return the spinner when the image has been added in the storage
  // showing the update / add contact based on the  state
  return (
    <Container fluid className="mt-5">
      <Row>
        <Col md="6" className="offset-md-3 p-2">
          <Form onSubmit={handleSubmit}>
            <div className="text-center">
              {isUploading ? (
                <Spinner type="grow" color="primary" />
              ) : (
                <div>
                  <label htmlFor="imagepicker" className="">
                    <img src={downloadUrl} alt="" className="profile" />
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="imagepicker"
                    accept="image/*"
                    multiple={false}
                    onChange={e => imagePicker(e)}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <FormGroup>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="number"
                name="number"
                id="phonenumber"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="phone number"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="textarea"
                name="area"
                id="area"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="address"
              />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  onChange={() => {
                    setStar(!star);
                  }}
                  checked={star}
                />{" "}
                <span className="text-right">Mark as Star</span>
              </Label>
            </FormGroup>
            <Button
              type="submit"
              color="primary"
              block
              className="text-uppercase"
            >
              {isUpdate ? "Update Contact" : "Add Contact"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddContact;
