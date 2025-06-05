import { useState } from 'react';
import {
    Stack,
    Input,
    Button,
    FormControl,
    FormLabel,
    Select,
    Option,
    Typography,
    IconButton,
} from '@mui/joy';
import './Form.css'
import { AxiosResponse } from 'axios';
import { TbEye, TbEyeClosed } from 'react-icons/tb';

export type Field = {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'select' | 'number' | 'url';
    required?: boolean;
    options?: string[]; // Solo para tipo select
    validate?: (value: string) => string | undefined
};

export type FormProps = {
    fields: Field[];
    initialValues?: Record<string, string>;
    onSubmit: (data: Record<string, string>) => void | Promise<any> | Promise<AxiosResponse<any, any>>;
    submitLabel?: string;
};

const Form = ({
    fields,
    initialValues = {},
    onSubmit,
    submitLabel = 'Enviar',
}: FormProps) => {
    const [form, setForm] = useState<Record<string, string>>(() =>
        fields.reduce((acc, field) => {
            acc[field.name] = initialValues[field.name] ?? '';
            return acc;
        }, {} as Record<string, string>)
    );

    const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (name: string, value: string) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const togglePassword = (fieldName: string) => {
        setShowPasswords((prev) => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            for (const field of fields) {
                const value = form[field.name] || '';
                if (field.validate) {
                    const message = field.validate(value);
                    if (message) {
                        throw new Error(message)
                    }

                }
            }
            const res = await onSubmit(form);
            setForm(fields.reduce((acc, field) => {
                acc[field.name] = initialValues[field.name] ?? '';
                return acc;
            }, {} as Record<string, string>))
        } catch (err: any) {
            console.log(err);
            setError(err.message || 'Error al enviar el formulario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                {fields.map((field) => (
                    <FormControl key={field.name} required={field.required}>
                        <FormLabel>{field.label}</FormLabel>
                        {field.type === 'select' && field.options ? (
                            <Select
                                value={form[field.name]}
                                onChange={(_, val) => handleChange(field.name, val ?? '')}
                                placeholder="Seleccionar..."
                                sx={{
                                    "& button:hover": {
                                        backgroundColor: 'transparent'
                                    },
                                    "& button:focus": {
                                        outline: 'none'
                                    }
                                }}
                            >
                                {field.options.map((opt) => (
                                    <Option key={opt} value={opt}>
                                        {opt}
                                    </Option>
                                ))}
                            </Select>
                        ) : (
                            <Input
                                type={
                                    field.type === 'password'
                                        ? showPasswords[field.name]
                                            ? 'text'
                                            : 'password'
                                        : field.type
                                }
                                name={field.name}
                                value={form[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                endDecorator={
                                    field.type === 'password' && (
                                        <IconButton
                                            variant='plain'
                                            sx={{
                                                "&:focus": {
                                                    outline: 'none'
                                                }
                                            }}
                                            onClick={() => togglePassword(field.name)}>
                                            {
                                                showPasswords[field.name]
                                                    ? (<TbEye />)
                                                    : (<TbEyeClosed />)
                                            }
                                        </IconButton>
                                    )
                                }
                            />
                        )}
                    </FormControl>
                ))}

                <Button variant='soft' type="submit" loading={loading} sx={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--surface)',
                    '&:hover': {
                        backgroundColor: 'var(--primary-light)'
                    }
                }}>
                    {submitLabel}
                </Button>

                {error && <Typography sx={{ color: 'var(--danger) !important' }}>{error}</Typography>}
            </Stack>
        </form>
    );
};

export default Form;
