import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Search, User } from "lucide-react";
import { useStudents, useCreateStudent } from "@/hooks/useStudents";
import { useNavigate } from "react-router-dom";

const Students = () => {
    const navigate = useNavigate();
    const { data: students, isLoading } = useStudents();
    const createStudent = useCreateStudent();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [newStudent, setNewStudent] = useState({
        name: "",
        birth_date: "",
        gender: "",
        email: "",
        phone: "",
        objective: "",
    });

    const filteredStudents = students?.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createStudent.mutateAsync({
                name: newStudent.name,
                birth_date: newStudent.birth_date,
                gender: newStudent.gender as "M" | "F",
                email: newStudent.email || undefined,
                phone: newStudent.phone || undefined,
                objective: newStudent.objective || undefined,
            });
            setIsDialogOpen(false);
            setNewStudent({
                name: "",
                birth_date: "",
                gender: "",
                email: "",
                phone: "",
                objective: "",
            });
        } catch (error) {
            console.error("Error creating student:", error);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                            Meus Alunos
                        </h1>
                        <p className="text-muted-foreground">
                            Gerencie seus alunos e acompanhe suas avaliações
                        </p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                                <UserPlus className="w-4 h-4" />
                                Novo Aluno
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Adicionar Novo Aluno</DialogTitle>
                                <DialogDescription>
                                    Preencha os dados básicos do aluno para começar.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateStudent} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo *</Label>
                                    <Input
                                        id="name"
                                        value={newStudent.name}
                                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="birth_date">Data de Nascimento *</Label>
                                        <Input
                                            id="birth_date"
                                            type="date"
                                            value={newStudent.birth_date}
                                            onChange={(e) => setNewStudent({ ...newStudent, birth_date: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Sexo *</Label>
                                        <Select
                                            value={newStudent.gender}
                                            onValueChange={(value) => setNewStudent({ ...newStudent, gender: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="M">Masculino</SelectItem>
                                                <SelectItem value="F">Feminino</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={newStudent.email}
                                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone</Label>
                                    <Input
                                        id="phone"
                                        value={newStudent.phone}
                                        onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={createStudent.isPending}>
                                    {createStudent.isPending ? "Salvando..." : "Cadastrar Aluno"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        className="pl-10"
                        placeholder="Buscar aluno por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : filteredStudents?.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <User className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">Nenhum aluno encontrado</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm ? "Tente buscar com outro termo" : "Comece adicionando seu primeiro aluno"}
                            </p>
                            {!searchTerm && (
                                <Button onClick={() => setIsDialogOpen(true)} variant="outline">
                                    Adicionar Aluno
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredStudents?.map((student) => (
                            <Card
                                key={student.id}
                                className="cursor-pointer hover:border-primary/50 transition-colors relative group"
                                onClick={() => navigate(`/students/${student.id}`)}
                            >
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{student.name}</CardTitle>
                                        <CardDescription>
                                            {new Date().getFullYear() - new Date(student.birth_date).getFullYear()} anos • {student.gender === 'M' ? 'Masculino' : 'Feminino'}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground">
                                        <p>{student.email || "Sem email"}</p>
                                        <p>{student.phone || "Sem telefone"}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Students;
