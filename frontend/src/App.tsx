import { Grid } from "@mui/material";
import LookupSection from "./sections/LookupSection";
import VehiclesSection from "./sections/VehiclesSection";
import ServiceHistorySection from "./sections/ServiceHistorySection";

const containerSx = {
  padding: "1rem 1.25rem 0rem",
  height: "99vh",
};

function App() {
  return (
    <Grid sx={containerSx} container>
      <Grid size={3} height={"100%"}>
        <LookupSection />
      </Grid>

      <Grid size={3} height={"100%"}>
        <VehiclesSection />
      </Grid>

      <Grid size={6} height={"100%"}>
        <ServiceHistorySection />
      </Grid>
    </Grid>
  );
}

export default App;
