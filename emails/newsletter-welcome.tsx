import { siteConfig } from "@/config/site";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import {
  anchor,
  box,
  container,
  footer,
  footerLeft,
  footerRight,
  hr,
  main,
  paragraph,
} from "./email-formats";
import { getBaseUrl } from "@/lib/urls/get-base-url";

/**
 * email for newsletter welcome
 */
export const NewsletterWelcomeEmail = ({ email }: { email: string }) => {
  const unsubscribeUrl = `${getBaseUrl()}/unsubscribe?email=${encodeURIComponent(email)}`;

  return (
    <Html>
      <Head />
      <Preview>Welcome to {siteConfig.name}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img
              src={`${getBaseUrl()}/logo.png`}
              width="32"
              height="32"
              alt="Logo"
            />
            <Hr style={hr} />
            <Text style={paragraph}>
              Welcome to our community! 
            </Text>
            <Text style={paragraph}>
              We value your participation and feedback. Please don't hesitate to
              reach out to us if you have any questions or suggestions.
            </Text>
            <Text style={paragraph}>
              Thanks, <br />
              The{" "}
              <Link style={anchor} href={getBaseUrl()}>
                {siteConfig.name}
              </Link>{" "}
              team
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              <span style={footerLeft}>
                &copy; {new Date().getFullYear()}
                &nbsp; All Rights Reserved.
              </span>
              <span style={footerRight}>
              </span>
            </Text>
            <Text style={footer}>
              <span>
                If you wish to unsubscribe, please{" "}
                <Link style={anchor} href={unsubscribeUrl} target="_blank">
                  click here
                </Link>
                .
              </span>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

NewsletterWelcomeEmail.PreviewProps = {
  email: "support@mksaas.com",
};

export default NewsletterWelcomeEmail;
