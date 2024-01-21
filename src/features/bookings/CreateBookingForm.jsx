import { useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useCreateBooking } from "./useCreateBooking";
import { flags } from "../../data/data-flags";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import { useCabins } from "../cabins/useCabins";
import { formatCurrency } from "../../utils/helpers";
import Textarea from "../../ui/Textarea";

function getTomorrow() {
  const today = new Date();
  const tomrrow = new Date(today);
  tomrrow.setDate(today.getDate() + 1);
  return tomrrow;
}

function CreateBookingForm({ onCloseModel }) {
  const [nationality, setNationality] = useState(flags.at(0).value);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(getTomorrow);
  const [finalForm, setFinalForm] = useState(false);

  const numNights = Math.round(
    Math.abs(endDate - startDate) / (24 * 60 * 60 * 1000)
  );

  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;

  const { createBooking, isCreatingBooking } = useCreateBooking();

  const { cabins, isLoading } = useCabins();

  const cabinOptions = isLoading
    ? []
    : cabins.map((cabin) => {
        return {
          value: cabin.id,
          label: `cabin ${cabin.name}->max capacity ${cabin.maxCapacity}`,
        };
      });
  const [cabinId, setCabinId] = useState(
    isLoading ? "" : cabinOptions.at(0).value
  );
  const currentCabinPrice = isLoading
    ? 0
    : cabins.find((cabin) => cabin.id === cabinId)?.regularPrice;
  const submitButtonText = finalForm
    ? `Book for ${formatCurrency(numNights * currentCabinPrice)}`
    : "Next";

  function onSubmit(data) {
    if (!finalForm) {
      setFinalForm(true);
    } else {
      const country = flags.find((flag) => flag.value === nationality).label;
      const countryFlag = `https://flagcdn.com/${nationality}.svg`;
      const { fullName, email, nationalID, numGuests, observations } = data;
      const guest = {
        fullName,
        email,
        nationalID,
        nationality: country,
        countryFlag,
      };
      const booking = {
        startDate: startDate.toISOString().slice(0, -1),
        endDate: endDate.toISOString().slice(0, -1),
        numNights,
        numGuests: Number(numGuests),
        cabinPrice: currentCabinPrice,
        extrasPrice: 0,
        totalPrice: numNights * currentCabinPrice,
        status: "unconfirmed",
        hasBreakfast: false,
        isPaid: false,
        observations,
        cabinId,
      };
      console.log(guest, booking);

      createBooking({ guest, booking });
    }
  }

  function handleNationalityChange(e) {
    setNationality(e.target.value);
  }

  function handleCabinChange(e) {
    setCabinId(+e.target.value);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {!finalForm && (
        <>
          <FormRow label="Full Name" error={errors?.fullName?.message}>
            <Input
              type="text"
              id="fullName"
              {...register("fullName", {
                required: "This field is required",
              })}
            />
          </FormRow>

          <FormRow label="Email" error={errors?.email?.message}>
            <Input
              type="text"
              id="email"
              {...register("email", {
                required: "This field is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please provide a vaild email address.",
                },
              })}
            />
          </FormRow>

          <FormRow label="Nationality">
            <Select
              id="nationality"
              options={flags}
              onChange={(e) => handleNationalityChange(e)}
              value={nationality}
            />
          </FormRow>

          <FormRow label="National ID" error={errors?.nationalID?.message}>
            <Input
              type="text"
              id="nationalID"
              {...register("nationalID", {
                required: "This field is required",
              })}
            />
          </FormRow>
        </>
      )}

      {finalForm && (
        <>
          <FormRow label="Number of guests" error={errors?.numGuests?.message}>
            <Input
              type="number"
              id="numGuests"
              {...register("numGuests", {
                required: "This field is required",
                min: {
                  value: 1,
                  message: "The capacity should be at least 1",
                },
              })}
              disabled={isCreatingBooking}
            />
          </FormRow>

          <FormRow label="Start Date">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              dateFormat="Pp"
            />
          </FormRow>
          <FormRow label="End Date">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              showTimeSelect
              dateFormat="Pp"
            />
          </FormRow>

          <FormRow label="Cabin">
            <Select
              id="cabin"
              options={cabinOptions}
              onChange={(e) => handleCabinChange(e)}
              value={cabinId}
            />
          </FormRow>

          <FormRow label="Observations">
            <Textarea
              type="text"
              id="observations"
              defaultValue=""
              {...register("observations")}
              disabled={isCreatingBooking}
            />
          </FormRow>
        </>
      )}

      <FormRow>
        {/* type is an HTML attribute!, which take cares of resetting the form */}
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModel?.()}
        >
          Cancel
        </Button>
        <Button disabled={isCreatingBooking}>{submitButtonText}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
