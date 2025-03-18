import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Edit2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());

        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText])
    return (
        <div>
            <Table>
                <TableCaption>A list of your recent registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead style={{ backgroundColor: '#bbdefb', color: 'black', padding: '10px', textAlign: 'left' }}>Logo</TableHead>
                        <TableHead style={{ backgroundColor: '#bbdefb', color: 'black', padding: '10px', textAlign: 'left' }}>Name</TableHead>
                        <TableHead style={{ backgroundColor: '#bbdefb', color: 'black', padding: '10px', textAlign: 'left' }}>Date</TableHead>
                        <TableHead style={{ backgroundColor: '#bbdefb', color: 'black', padding: '10px', textAlign: 'left' }}>Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        filterCompany?.map((company) => (
                            <tr>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={company.logo} />
                                    </Avatar>
                                </TableCell>
                                <TableCell>{company.name}</TableCell>
                                <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">

                                    <div onClick={() => navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                                        <Edit2 className='w-4' />
                                        <span>Edit</span>
                                    </div>

                                </TableCell>
                            </tr>

                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable