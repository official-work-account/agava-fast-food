import { Helmet } from "react-helmet-async";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome to Agava Fast Food",
  description: "Tasty meals at affordable prices.",
  keywords:
    "jollof rice & chicken, fried rice & chicken, plain rice & chicken, jollof rice & fish, fried rice & fish, plain rice & fish",
};

export default Meta;
