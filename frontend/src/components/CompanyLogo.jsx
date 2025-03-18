import React, { useEffect, useRef } from 'react';
import adidas from '../images/adidas.png';
import infosys from '../images/infosys.png';
import microsoft from '../images/microsoft.png';
import apple from '../images/apple.png';
import google from '../images/google.png';
import bata from '../images/bata.png';
import amazon from '../images/amazon.png';
import kia from '../images/kia.png';
import nvidia from '../images/nvidia.png';
import meta from '../images/meta.png';
import puma from '../images/puma.png';
import tesla from '../images/tesla.png';

const logos = [adidas, microsoft, infosys, apple, google, kia, bata, nvidia, amazon, puma, tesla, meta];

const CompanyLogo = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        let scrollSpeed = 1;
        
        const animate = () => {
            if (container) {
                container.scrollLeft += scrollSpeed;
                if (container.scrollLeft >= container.scrollWidth / 2) {
                    container.scrollLeft = 0;
                }
            }
            requestAnimationFrame(animate);
        };

        animate();
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px", overflow: "hidden", whiteSpace: "nowrap" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
                Top Hiring Companies
            </h1>
            <div
                ref={containerRef}
                style={{
                    display: "flex",
                    width: "100%",
                    height: "120px",
                    alignItems: "center",
                    overflow: "hidden",
                    position: "relative",
                    whiteSpace: "nowrap"
                }}
            >
                {[...logos, ...logos].map((logo, index) => (
                    <div key={index} style={{ padding: "15px 30px", margin: "0 20px", flexShrink: 0 }}>
                        <img
                            src={logo}
                            alt="Company Logo"
                            style={{
                                width: "100px",
                                height: "auto",
                                transition: "transform 0.3s ease, filter 0.3s ease"
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = "scale(1.2)";
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = "scale(1)";
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanyLogo;