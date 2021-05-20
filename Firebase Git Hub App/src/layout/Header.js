import React, { useState, useContext } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText
} from "reactstrap";

import { Link } from "react-router-dom";

import { UserContext } from "../context/UserContext";

const Header = () => {

  const context = useContext(UserContext);   

  const [isOpen, setIsOpen] = useState(false);  //toggle part when u shrink the page and 3 lines are seen

  const toggle = () => setIsOpen(!isOpen);   //flip the switch on & off


  return (
    <Navbar color="info" light expand="md">
      <NavbarBrand>
        <Link to="/" className="text-white">
          LCO gitfire app
        </Link>
      </NavbarBrand>
      <NavbarText className="text-white">
        {
          context.user?.email ? context.user.email : ""
        }
      </NavbarText>
      <NavbarToggler onClick = {toggle} />
      <Collapse isOpen= {isOpen} navbar>
        <Nav className="ml-auto" navbar>
          {
            context.user ? (
              <NavItem>
                <NavLink onClick={() => {context.setUser(null)}} className="text-white">
                  Logout
                </NavLink>
            </NavItem>
            ) : (
              <>
                <NavItem>
                  <NavLink tag={Link} to="/signup" className="text-white">
                      Signup
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/signin" className="text-white">
                      Signin
                  </NavLink>
                </NavItem>
              </>
            )
          }
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Header;
