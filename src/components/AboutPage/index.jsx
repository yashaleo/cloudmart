import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";

const AboutPage = () => {
  return (
    <Box sx={{ py: 8, flexGrow: 1 }}>
      <Container component="main">
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          About CloudMart
        </Typography>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Our Project
          </Typography>
          <Typography paragraph>
            CloudMart is an innovative e-commerce platform developed as part of
            an intensive cloud computing and artificial intelligence training
            program by The Cloud Bootcamp. This project serves as a
            comprehensive learning experience, combining cutting-edge
            technologies to create a modern, AI-powered online shopping
            solution.
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Key Features
          </Typography>
          <List>
            {[
              "AI-powered product recommendations",
              "Cloud-based infrastructure for scalability and reliability",
              "Real-time inventory management",
              "Secure payment processing",
              "Personalized user experiences",
              "Changed UI to match the new branding with MUI",
            ].map((feature) => (
              <ListItem key={feature} sx={{ pl: 0 }}>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
          </List>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Technologies Used
          </Typography>
          <List>
            {[
              "AWS (Amazon Web Services) for cloud infrastructure",
              "React for frontend development",
              "Node.js and Express for backend services",
              "Machine Learning models for product recommendations",
              "Natural Language Processing for customer support chatbot",
            ].map((tech) => (
              <ListItem key={tech} sx={{ pl: 0 }}>
                <ListItemText primary={tech} />
              </ListItem>
            ))}
          </List>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            About The Cloud Bootcamp
          </Typography>
          <Typography paragraph>
            The Cloud Bootcamp is a leading provider of intensive, hands-on
            training in cloud computing and artificial intelligence. Through
            projects like CloudMart, they offer students the opportunity to gain
            practical experience with real-world applications of cloud and AI
            technologies.
          </Typography>
          <Typography>
            For more information about The Cloud Bootcamp and their programs,
            visit{" "}
            <Link
              href="https://www.thecloudbootcamp.com"
              color="primary"
              underline="hover"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.thecloudbootcamp.com
            </Link>
            .
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;
