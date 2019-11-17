# Easypost External Adapter for Chainlink

## Input Params
- `code`: The shipping code
- `car`: The carrier

## Output Format

```json
{
  "jobRunID": "127",
  "data": {
    "id": "trk_5417eff3151d44fd80ae32703584ea19",
    "object": "Tracker",
    "mode": "test",
    "tracking_code": "EZ1000000001",
    "status": "pre_transit",
    "est_delivery_date": "2018-09-10T22:33:49Z",
    "carrier": "USPS",
    "tracking_details": [
      {
        "object": "TrackingDetail",
        "message": "Pre-Shipment Info Sent to USPS",
        "description": null,
        "status": "pre_transit",
        "status_detail": "status_update",
        "datetime": "2018-08-10T22:33:49Z",
        "source": "USPS",
        "carrier_code": null,
        "tracking_location": {
          "object": "TrackingLocation",
          "city": null,
          "state": null,
          "country": null,
          "zip": null
        }
      },
      {
        "object": "TrackingDetail",
        "message": "Shipping Label Created",
        "description": null,
        "status": "pre_transit",
        "status_detail": "status_update",
        "datetime": "2018-08-11T11:10:49Z",
        "source": "USPS",
        "carrier_code": null,
        "tracking_location": {
          "object": "TrackingLocation",
          "city": "HOUSTON",
          "state": "TX",
          "country": null,
          "zip": "77063"
        }
      }
    ],
    "carrier_detail": {
      "object": "CarrierDetail",
      "service": "First-Class Package Service",
      "container_type": null,
      "est_delivery_date_local": null,
      "est_delivery_time_local": null,
      "origin_location": "HOUSTON TX, 77001",
      "origin_tracking_location": {
        "object": "TrackingLocation",
        "city": "HOUSTON",
        "state": "TX",
        "country": null,
        "zip": "77063"
      },
      "destination_location": "CHARLESTON SC, 29401",
      "destination_tracking_location": null,
      "guaranteed_delivery_date": null,
      "alternate_identifier": null,
      "initial_delivery_attempt": null
    },
    "public_url": "https://track.easypost.com/djE6dHJrXzU0MTdlZmYzMTUxZDQ0ZmQ4MGFlMzI3MDM1ODRlYTE5",
    "fees": [
      {
        "object": "Fee",
        "type": "TrackerFee",
        "amount": "0.00000",
        "charged": false,
        "refunded": false
      }
    ],
    "created_at": "2018-09-10T22:33:49Z",
    "updated_at": "2018-09-10T22:33:49Z"
  }
}
```

## Run with Docker
```bash
docker build . -t easypost-adapter
docker run -d \
    --name easypost-adapter \
    -p 8080:8080 \
    -e PORT=8080 \
    -e API_KEY=Your_API_key_here \
    easypost-adapter
```

## Install

```bash
npm install
```

## Test

```bash
npm test
```

## Create the zip

```bash
zip -r cl-easypost.zip .
```

## Install to GCP

- In Functions, create a new function, choose to ZIP upload
- Click Browse and select the `cl-easypost.zip` file
- Select a Storage Bucket to keep the zip in
- Function to execute: gcpservice
- Click More, Add variable
  - NAME: API_KEY
  - VALUE: Your_API_key

## Install to AWS Lambda

- In Lambda Functions, create function
- On the Create function page:
  - Give the function a name
  - Use Node.js 8.10 for the runtime
  - Choose an existing role or create a new one
  - Click Create Function
- Under Function code, select "Upload a .zip file" from the Code entry type drop-down
- Click Upload and select the `cl-easypost.zip` file
- Handler should remain index.handler
- Add the environment variable:
  - Key: API_KEY
  - Value: Your_API_key
- Save
