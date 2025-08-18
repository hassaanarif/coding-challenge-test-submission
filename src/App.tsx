import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Form from "@/components/Form/Form";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import useFormFields from "@/hooks/useFormFields";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

function App() {
  /**
   * Form fields states using custom hook
   */
  const {
    formFields,
    handleFieldChange: updateField,
    clearAllFields,
  } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });

  const { postCode, houseNumber, firstName, lastName, selectedAddress } = formFields;

  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [loading, setLoading] = React.useState(false);

  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /**
   * Generic field change handler
   */
  const handleFieldChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(fieldName, e.target.value);
    // Clear error when user starts typing
    if (error) setError(undefined);
  };

  /** Fetch addresses based on houseNumber and postCode using the local BE api */
  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous results and errors
    setAddresses([]);
    setError(undefined);

    // Basic validation
    if (!postCode.trim() || !houseNumber.trim()) {
      setError("Post code and house number are required!");
      return;
    }

    if (postCode.trim().length < 4) {
      setError("Post code must be at least 4 digits!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/getAddresses?postcode=${postCode.trim()}&streetnumber=${houseNumber.trim()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.details && Array.isArray(data.details)) {
        // Transform addresses to add house number
        const transformedAddresses = data.details.map((address: any) => ({
          ...address,
          houseNumber: houseNumber.trim(),
        }));
        setAddresses(transformedAddresses);

        if (transformedAddresses.length === 0) {
          setError("No addresses found for the given post code and house number.");
        }
      } else {
        setError("Invalid response format from server.");
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError("Failed to fetch addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /** Add basic validation to ensure first name and last name fields aren't empty */
  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation for first name and last name
    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!selectedAddress || !addresses.length) {
      setError("No address selected, try to select an address or find one if you haven't");
      return;
    }

    const foundAddress = addresses.find((address) => address.id === selectedAddress);

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName: firstName.trim(), lastName: lastName.trim() });

    // Clear form after successful submission
    clearAllFields();
    setAddresses([]);
    setError(undefined);
  };

  /** Clear all form fields, search results and error messages */
  const handleClearAll = () => {
    clearAllFields();
    setAddresses([]);
    setError(undefined);
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>Enter an address by postcode add personal info and done! 👏</small>
        </h1>

        <Form
          onSubmit={handleAddressSubmit}
          legend="🏠 Find an address"
          submitButtonText="Find"
          submitButtonVariant="primary"
        >
          <div className={styles.formRow}>
            <InputText
              name="postCode"
              onChange={handleFieldChange("postCode")}
              placeholder="Post Code"
              value={postCode}
            />
          </div>
          <div className={styles.formRow}>
            <InputText
              name="houseNumber"
              onChange={handleFieldChange("houseNumber")}
              value={houseNumber}
              placeholder="House number"
            />
          </div>
        </Form>

        {loading && (
          <div className={styles.loading}>
            <div data-testid="loading-spinner" className={styles.spinner}></div>
            <span>Searching for addresses...</span>
          </div>
        )}

        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={(e) => updateField("selectedAddress", e.target.value)}
                checked={selectedAddress === address.id}
              >
                <Address {...address} />
              </Radio>
            );
          })}

        {selectedAddress && (
          <Form
            onSubmit={handlePersonSubmit}
            legend="✏️ Add personal info to address"
            submitButtonText="Add to addressbook"
            submitButtonVariant="primary"
          >
            <div className={styles.formRow}>
              <InputText
                name="firstName"
                placeholder="First name"
                onChange={handleFieldChange("firstName")}
                value={firstName}
              />
            </div>
            <div className={styles.formRow}>
              <InputText
                name="lastName"
                placeholder="Last name"
                onChange={handleFieldChange("lastName")}
                value={lastName}
              />
            </div>
          </Form>
        )}

        <ErrorMessage message={error || ""} />

        {(postCode || houseNumber || firstName || lastName || selectedAddress || addresses.length > 0) && (
          <div className={styles.clearButtonContainer}>
            <Button onClick={handleClearAll} variant="secondary">
              Clear all fields
            </Button>
          </div>
        )}
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
