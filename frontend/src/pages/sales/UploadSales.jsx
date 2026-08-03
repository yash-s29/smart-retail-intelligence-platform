import { useState } from "react";

import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  LinearProgress,
  Chip,
} from "@mui/material";
import { PrimaryButton } from '../../components/ui';


import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";


import { useNavigate } from "react-router-dom";


import salesApi from "../../services/salesApi";



/* ==========================================================
   CONSTANTS
========================================================== */


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB





/* ==========================================================
   COMPONENT
========================================================== */


const UploadSales = () => {


  const navigate = useNavigate();





  /* ==========================================================
      STATES
  ========================================================== */


  const [file, setFile] = useState(null);


  const [isDragging, setIsDragging] = useState(false);


  const [uploading, setUploading] = useState(false);


  const [uploadProgress, setUploadProgress] = useState(0);


  const [uploadResult, setUploadResult] = useState(null);


  const [errorMessage, setErrorMessage] = useState("");









  /* ==========================================================
      FILE VALIDATION
  ========================================================== */


  const validateFile = (selectedFile) => {


    if (!selectedFile) {

      return "Please select a CSV file.";

    }



    if (
      !selectedFile.name
        .toLowerCase()
        .endsWith(".csv")
    ) {

      return "Only CSV files are allowed.";

    }



    if (selectedFile.size > MAX_FILE_SIZE) {


      return "Maximum file size allowed is 10 MB.";

    }



    return "";

  };









  /* ==========================================================
      SET SELECTED FILE
  ========================================================== */


  const setSelectedFile = (selectedFile) => {


    const validation = validateFile(selectedFile);



    if (validation) {


      setErrorMessage(validation);


      setFile(null);


      return;

    }



    setFile(selectedFile);


    setErrorMessage("");


    setUploadResult(null);


    setUploadProgress(0);


  };









  /* ==========================================================
      DRAG EVENTS
  ========================================================== */


  const handleDragOver = (event) => {


    event.preventDefault();


    setIsDragging(true);


  };





  const handleDragLeave = (event) => {


    event.preventDefault();


    setIsDragging(false);


  };





  const handleDrop = (event) => {


    event.preventDefault();


    setIsDragging(false);



    const droppedFile =
      event.dataTransfer.files[0];



    setSelectedFile(droppedFile);


  };









  /* ==========================================================
      FILE PICKER
  ========================================================== */


  const handleFileSelect = (event) => {


    const selectedFile =
      event.target.files[0];



    setSelectedFile(selectedFile);


  };









  /* ==========================================================
      REMOVE FILE
  ========================================================== */


  const handleRemoveFile = () => {


    setFile(null);


    setUploadResult(null);


    setUploadProgress(0);


    setErrorMessage("");



    const input =
      document.getElementById(
        "csv-upload-input"
      );



    if (input) {


      input.value = "";

    }


  };









  /* ==========================================================
      UPLOAD CSV
  ========================================================== */


  const handleUpload = async () => {


    if (!file) {


      setErrorMessage(
        "Please select a CSV file first."
      );


      return;

    }




    try {


      setUploading(true);


      setUploadProgress(10);


      setErrorMessage("");



      const response =
        await salesApi.uploadSalesCSV(

          file,

          {

            onUploadProgress:
              (progressEvent) => {


                const percent = Math.round(

                  (

                    progressEvent.loaded *

                    100

                  )

                  /

                  progressEvent.total

                );


                setUploadProgress(percent);


              },


          }

        );



      setUploadProgress(100);



      setUploadResult(response);



    }

    catch(error) {


      console.error(
        "CSV Upload Error:",
        error
      );



      setUploadResult(null);



      setUploadProgress(0);



      setErrorMessage(

        error?.response?.data?.detail ||

        "CSV upload failed. Please try again."

      );


    }


    finally {


      setUploading(false);


    }


  };









  /* ==========================================================
      NAVIGATION
  ========================================================== */


  const goBack = () => {


    navigate("/sales");


  };
  /* ==========================================================
      JSX
  ========================================================== */


  return (

    <Container

      maxWidth="md"

      sx={{

        py: {

          xs: 3,

          sm: 5,

          md: 6,

        },

      }}

    >


      {/* ==========================================================
          HEADER
      ========================================================== */}


      <PrimaryButton variant="text" startIcon={<ArrowLeft size={18} />} onClick={goBack} sx={{ mb: 3, textTransform: "none", borderRadius: 2 }}>
        Back to Sales
      </PrimaryButton>





      <Typography variant="h4" fontWeight={700} mb={3}>
        Upload Sales
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
        <PrimaryButton
          fullWidth
          variant="outlined"
          size="large"
          disabled={uploading}
          onClick={handleRemoveFile}
          sx={{ height: 54, borderRadius: 3, textTransform: "none", fontWeight: 700 }}
        >
          Remove File
        </PrimaryButton>

        <PrimaryButton
          fullWidth
          variant="contained"
          size="large"
          disabled={uploading}
          onClick={handleUpload}
          sx={{ height: 54, borderRadius: 3, textTransform: "none", fontWeight: 700 }}
        >
          {uploading ? "Importing Sales..." : "Import Sales CSV"}
        </PrimaryButton>
      </Stack>

      {/* ==========================================================
          ERROR MESSAGE
      ========================================================== */}


      {
        errorMessage && (

          <Paper

            elevation={0}

            sx={{

              mb: 4,

              p: 2.5,

              borderRadius: 3,

              bgcolor: "#FEF2F2",

              border: "1px solid",

              borderColor: "error.light",

            }}

          >

            <Stack

              direction="row"

              spacing={2}

              alignItems="center"

            >

              <AlertTriangle

                size={22}

                color="#dc2626"

              />


              <Typography

                color="error.main"

              >

                {errorMessage}

              </Typography>


            </Stack>


          </Paper>


        )

      }









      {/* ==========================================================
          DRAG DROP AREA
      ========================================================== */}


      <Paper

        elevation={0}

        onDragOver={handleDragOver}

        onDragLeave={handleDragLeave}

        onDrop={handleDrop}

        onClick={() =>

          document

            .getElementById(
              "csv-upload-input"
            )

            ?.click()

        }

        sx={{

          p: {

            xs: 4,

            md: 7,

          },


          borderRadius: 5,


          border: "2px dashed",


          borderColor:

            isDragging

              ? "primary.main"

              : "divider",



          bgcolor:

            isDragging

              ? "rgba(99,102,241,0.05)"

              : "background.paper",



          cursor: "pointer",



          transition: "0.3s",



          textAlign: "center",



          "&:hover": {

            borderColor: "primary.main",

            bgcolor:

              "rgba(99,102,241,0.04)",

          },

        }}

      >



        <Upload

          size={60}

          color="#6366F1"

        />





        <Typography

          variant="h6"

          fontWeight={700}

          mt={3}

        >

          Drag & Drop your CSV file

        </Typography>





        <Typography

          color="text.secondary"

          mt={1}

        >

          or click anywhere to browse

        </Typography>





        <Typography

          variant="body2"

          color="text.secondary"

          mt={2}

        >

          Supported format: CSV only

        </Typography>





        <input

          id="csv-upload-input"

          hidden

          type="file"

          accept=".csv"

          onChange={handleFileSelect}

        />



      </Paper>









      {/* ==========================================================
          SELECTED FILE PREVIEW
      ========================================================== */}


      {
        file && (

          <Paper

            elevation={0}

            sx={{

              mt: 4,

              p: 3,

              borderRadius: 4,

              border: "1px solid",

              borderColor: "divider",

            }}

          >


            <Stack

              direction="row"

              justifyContent="space-between"

              alignItems="center"

              spacing={2}

            >


              <Stack

                direction="row"

                spacing={2}

                alignItems="center"

              >


                <FileText

                  size={34}

                  color="#6366F1"

                />



                <Box>


                  <Typography

                    fontWeight={700}

                  >

                    {file.name}

                  </Typography>




                  <Typography

                    variant="body2"

                    color="text.secondary"

                  >

                    {(file.size / 1024).toFixed(2)}

                    {" KB"}

                  </Typography>



                </Box>



              </Stack>





              <Chip

                color="success"

                label="Ready"

              />



            </Stack>



          </Paper>


        )

      }









      {/* ==========================================================
          ACTION BUTTONS
      ========================================================== */}


      {
        file && !uploadResult && (

          <Stack

            direction={{

              xs: "column",

              sm: "row",

            }}

            spacing={2}

            mt={4}

          >



            <PrimaryButton

              fullWidth

              variant="outlined"

              size="large"

              disabled={uploading}

              onClick={handleRemoveFile}

              sx={{

                height: 54,

                borderRadius: 3,

                textTransform: "none",

                fontWeight: 700,

              }}

            >

              Remove File

            </PrimaryButton>





            <PrimaryButton

              fullWidth

              variant="contained"

              size="large"

              disabled={uploading}

              onClick={handleUpload}

              sx={{

                height: 54,

                borderRadius: 3,

                textTransform: "none",

                fontWeight: 700,

              }}

            >


              {

                uploading

                  ? "Importing Sales..."

                  : "Import Sales CSV"

              }


            </PrimaryButton>



          </Stack>


        )

      }









      {/* ==========================================================
          UPLOAD PROGRESS
      ========================================================== */}


      {

        uploading && (

          <Paper

            elevation={0}

            sx={{

              mt: 4,

              p: 3,

              borderRadius: 4,

              border: "1px solid",

              borderColor: "divider",

            }}

          >


            <Typography

              fontWeight={700}

              mb={2}

            >

              Upload Progress

            </Typography>




            <LinearProgress

              variant="determinate"

              value={uploadProgress}

              sx={{

                height: 10,

                borderRadius: 20,

              }}

            />




            <Typography

              mt={2}

              align="center"

              color="text.secondary"

            >

              {uploadProgress}% Completed

            </Typography>



          </Paper>


        )

      }
            {/* ==========================================================
          FILE PREVIEW
      ========================================================== */}

      {file && (
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
            spacing={2}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <FileText
                size={36}
                color="#6366F1"
              />

              <Box>
                <Typography
                  fontWeight={700}
                  sx={{
                    wordBreak: "break-word",
                  }}
                >
                  {file.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {(file.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
            </Stack>


            <Chip
              label="Ready"
              color="success"
              sx={{
                fontWeight: 700,
              }}
            />

          </Stack>
        </Paper>
      )}


      {/* ==========================================================
          ACTION BUTTONS
      ========================================================== */}

      {file && !uploadResult && (

        <Stack
          direction={{
            xs:"column",
            sm:"row",
          }}
          spacing={2}
          mt={4}
        >

          <PrimaryButton fullWidth variant="outlined" disabled={uploading} onClick={handleRemoveFile} sx={{ height:54, borderRadius:3, textTransform:"none", fontWeight:700 }}>Remove File</PrimaryButton>

          <PrimaryButton fullWidth variant="contained" disabled={uploading || !file} onClick={handleUpload} startIcon={<Upload size={18}/>} sx={{ height:54, borderRadius:3, textTransform:"none", fontWeight:700 }}>
            {uploading ? "Importing..." : "Import Sales"}
          </PrimaryButton>


        </Stack>

      )}



      {/* ==========================================================
          UPLOAD PROGRESS
      ========================================================== */}

      {uploading && (

        <Paper
          elevation={0}
          sx={{
            mt:4,
            p:3,
            borderRadius:4,
            border:"1px solid",
            borderColor:"divider",
          }}
        >

          <Typography
            fontWeight={700}
            mb={2}
          >
            Processing CSV File
          </Typography>


          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{
              height:10,
              borderRadius:10,
            }}
          />


          <Typography
            mt={2}
            align="center"
            color="text.secondary"
          >
            {uploadProgress}% completed
          </Typography>


        </Paper>

      )}



      {/* ==========================================================
          SUCCESS RESULT
      ========================================================== */}


      {uploadResult && (

        <Paper
          elevation={0}
          sx={{
            mt:5,
            p:4,
            borderRadius:4,
            border:"1px solid",
            borderColor:"success.light",
          }}
        >


          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            mb={4}
          >

            <CheckCircle
              size={34}
              color="#16a34a"
            />


            <Box>

              <Typography
                variant="h6"
                fontWeight={800}
              >
                Import Completed
              </Typography>


              <Typography
                color="text.secondary"
              >
                Sales CSV has been processed.
              </Typography>

            </Box>


          </Stack>



          <Stack
            direction={{
              xs:"column",
              sm:"row",
            }}
            spacing={2}
          >


            <Paper
              variant="outlined"
              sx={{
                flex:1,
                p:3,
                textAlign:"center",
                borderRadius:3,
              }}
            >

              <Typography
                variant="h4"
                fontWeight={800}
                color="success.main"
              >
                {
                  uploadResult.inserted ?? 0
                }
              </Typography>


              <Typography
                color="text.secondary"
              >
                Imported
              </Typography>


            </Paper>



            <Paper
              variant="outlined"
              sx={{
                flex:1,
                p:3,
                textAlign:"center",
                borderRadius:3,
              }}
            >

              <Typography
                variant="h4"
                fontWeight={800}
                color="warning.main"
              >
                {
                  uploadResult.skipped ?? 0
                }
              </Typography>


              <Typography
                color="text.secondary"
              >
                Skipped
              </Typography>


            </Paper>



            <Paper
              variant="outlined"
              sx={{
                flex:1,
                p:3,
                textAlign:"center",
                borderRadius:3,
              }}
            >

              <Typography
                variant="h4"
                fontWeight={800}
                color="error.main"
              >
                {
                  uploadResult.errors?.length ?? 0
                }
              </Typography>


              <Typography
                color="text.secondary"
              >
                Failed
              </Typography>


            </Paper>


          </Stack>
                    {/* ======================================================
              ERROR DETAILS
          ====================================================== */}

          {
            uploadResult.errors &&
            uploadResult.errors.length > 0 && (

              <Paper
                variant="outlined"
                sx={{
                  mt:4,
                  p:3,
                  borderRadius:3,
                  borderColor:"error.light",
                }}
              >

                <Typography
                  fontWeight={800}
                  color="error.main"
                  mb={2}
                >
                  Import Errors
                </Typography>


                <Stack spacing={1}>

                  {
                    uploadResult.errors.map(
                      (error,index)=>(
                        
                        <Typography
                          key={index}
                          variant="body2"
                          color="text.secondary"
                        >
                          • {error}
                        </Typography>

                      )
                    )
                  }

                </Stack>


              </Paper>

            )
          }



          {/* ======================================================
              BACK TO SALES
          ====================================================== */}


          <PrimaryButton

            fullWidth

            variant="contained"

            onClick={() =>
              navigate("/sales")
            }

            sx={{
              mt:4,
              height:54,
              borderRadius:3,
              textTransform:"none",
              fontWeight:700,
            }}

          >

            Back To Sales

          </PrimaryButton>


        </Paper>

      )}



      {/* ==========================================================
          CSV TEMPLATE INFORMATION
      ========================================================== */}


      <Paper

        elevation={0}

        sx={{

          mt:5,

          p:4,

          borderRadius:4,

          border:"1px solid",

          borderColor:"divider",

          bgcolor:"background.paper",

        }}

      >


        <Stack

          direction="row"

          spacing={2}

          alignItems="center"

          mb={3}

        >

          <FileText
            size={32}
            color="#6366F1"
          />


          <Box>


            <Typography
              variant="h6"
              fontWeight={800}
            >

              CSV Format Required

            </Typography>


            <Typography
              variant="body2"
              color="text.secondary"
            >

              Upload file containing these columns.

            </Typography>


          </Box>


        </Stack>




        <Stack

          direction="row"

          spacing={1}

          flexWrap="wrap"

          useFlexGap

        >

          <Chip label="invoice_number"/>

<Chip label="product_sku"/>

<Chip label="customer_name"/>

<Chip label="quantity"/>

<Chip label="unit_price"/>

<Chip label="payment_method"/>

<Chip label="sale_date"/>


        </Stack>




        <Typography

          mt={3}

          variant="body2"

          color="text.secondary"

          lineHeight={1.8}

        >

          Required fields are validated before importing.
          Invalid rows are skipped and reported after processing.
          Inventory quantity is automatically updated after
          successful import.

        </Typography>




        <PrimaryButton

          variant="outlined"

          sx={{

            mt:3,

            borderRadius:3,

            textTransform:"none",

            fontWeight:700,

          }}

          onClick={()=>{
            console.log(
              "Sample CSV download coming soon"
            );
          }}

        >

          Download Sample CSV

        </PrimaryButton>



      </Paper>



    </Container>

  );

};


export default UploadSales;