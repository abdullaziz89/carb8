import {useEffect, useState} from "react";
import {Keyboard} from "react-native";

const DAYS = [
    {id: 0, name: "All Days"},
    {id: 1, name: "Week Days"},
    {id: 2, name: "Weekend"},
    {id: 3, name: "Sunday"},
    {id: 4, name: "Monday"},
    {id: 5, name: "Tuesday"},
    {id: 6, name: "Wednesday"},
    {id: 7, name: "Thursday"},
    {id: 8, name: "Friday"},
    {id: 9, name: "Saturday"}
];

const wantedPaymentGatewayResponse = [
    "payment_id",
    "ref",
    "order_id",
    "requested_order_id",
    "payment_type",
    "invoice_id",
    "transaction_date",
    "receipt_id"
]

export { DAYS, wantedPaymentGatewayResponse }

