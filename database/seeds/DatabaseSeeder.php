<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        $user_valdor_id = DB::table('users')->insertGetId(
            array(
                'name' => 'Jad Joubran',
                'email' => 'joubran.jad@gmail.com',
                'password' => Hash::make('laravel_angular')
            )
        );

        Model::reguard();
    }
}
