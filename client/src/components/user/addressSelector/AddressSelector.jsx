import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./AddressSelector.module.css";
import { fetchUserDetails } from "../../../features/user/UserDetailsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";

const AddressSelector = ({ onSelect }) => {
  const dispatch = useDispatch();
  const { userDto } = useSelector((state) => state.userDetails);
  const [addresses, setAddresses] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const action = async () => {
      dispatch(fetchUserDetails());
    };
    action();
  }, [dispatch]);

  useEffect(() => {
    setAddresses(userDto.addresses || []);
    setSelectedAddress(
      userDto?.addresses?.find(
        (address) => address.id === userDto.defaultAddressId
      ) || addresses?.[0]
    );
  }, [userDto]);

  const handleAddressChange = (address) => {
    setSelectedAddress(address);
    onSelect(address.id);
    setShowAll(false);
  }

  return (
    <div className={styles.selector_wrap}>
      <div className={styles.selected_address_wrap}>
        {selectedAddress && (
          <div className={styles.selected_address}>
            <p>
              <strong>House No:</strong> {selectedAddress.houseNo}
            </p>
            <p>
              <strong>Street:</strong> {selectedAddress.street}
            </p>
            <p>
              <strong>City:</strong> {selectedAddress.city}
            </p>
            <p>
              <strong>State:</strong> {selectedAddress.state}
            </p>
            <p>
              <strong>Pin Code:</strong> {selectedAddress.pinCode}
            </p>
            <p>
              <strong>Landmark:</strong> {selectedAddress.landmark}
            </p>
          </div>
        )}
      </div>

      <div
        className={styles.see_details_wrap}
        onClick={(e) => setShowAll(!showAll)}
      >
        {showAll ? (
          <>
            <span>cancel</span>
            <FontAwesomeIcon icon={faCaretUp} />
          </>
        ) : (
          <>
            <span>change address </span>
            <FontAwesomeIcon icon={faCaretDown} />
          </>
        )}
      </div>

      {addresses && showAll ? (
        <div className={styles.address_options}>
          {addresses.map((address, index) => (
            <div className={styles.show_address} key={index} onClick={() => handleAddressChange(address)}>
              <p>
                <strong>House No:</strong> {address.houseNo}
              </p>
              <p>
                <strong>Street:</strong> {address.street}
              </p>
              <p>
                <strong>City:</strong> {address.city}
              </p>
              <p>
                <strong>State:</strong> {address.state}
              </p>
              <p>
                <strong>Pin Code:</strong> {address.pinCode}
              </p>
              <p>
                <strong>Landmark:</strong> {address.landmark}
              </p>
            </div>
          ))}
          <div 
            className={styles.add_new_add}
            onClick={() => navigate('/addresses')}
          >
            <span>add new address</span>
            <FontAwesomeIcon icon={faPlus}/>
          </div>
        </div>
      ) : showAll && (
        <div className={styles.demo_loading}></div>
      )}
    </div>
  );
};

export default AddressSelector;
